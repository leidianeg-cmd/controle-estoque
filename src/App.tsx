import React, { useState, useEffect, useMemo } from 'react';
import { Product, StockMovement, UserProfile, TabType } from './types';
import { initialProducts, initialMovements, initialUser, sampleProducts, sampleMovements } from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { ProductFormView } from './components/ProductFormView';
import { MovementsView } from './components/MovementsView';
import { AlertsView } from './components/AlertsView';
import { ManagementView } from './components/ManagementView';
import { LoginView } from './components/LoginView';
import { ProductModal } from './components/ProductModal';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  // Estado de autenticação - inicia como null para exibir a página de login solicitada
  const [user, setUser] = useState<UserProfile | null>(() => {
    const isSessionActive = sessionStorage.getItem('stockflow_session_active');
    if (!isSessionActive) {
      localStorage.removeItem('stockflow_user');
      return null;
    }
    const saved = localStorage.getItem('stockflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Produtos (inicia limpo conforme solicitado)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('stockflow_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Histórico de movimentações
  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('stockflow_movements');
    return saved ? JSON.parse(saved) : [];
  });

  // Aba ativa e controles de interface
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sincronização com localStorage
  useEffect(() => {
    localStorage.setItem('stockflow_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stockflow_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('stockflow_user', JSON.stringify(user));
      sessionStorage.setItem('stockflow_session_active', 'true');
    } else {
      localStorage.removeItem('stockflow_user');
      sessionStorage.removeItem('stockflow_session_active');
    }
  }, [user]);

  // Contagem de alertas ativos
  const alertCount = useMemo(() => {
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);

    const lowCount = products.filter((p) => p.currentStock <= p.minStock).length;
    const expiringCount = products.filter((p) => {
      if (!p.expiryDate) return false;
      return new Date(p.expiryDate) <= thirtyDays;
    }).length;

    return lowCount + expiringCount;
  }, [products]);

  // Login handler
  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setActiveTab('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
  };

  // Manipulador de movimentações (Entrada / Saída)
  const handleRegisterMovement = (
    movementData: Omit<StockMovement, 'id' | 'date'>
  ): { success: boolean; message?: string } => {
    const targetProduct = products.find((p) => p.id === movementData.productId);
    if (!targetProduct) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    // RN01: Trava de Estoque Negativo
    if (movementData.type === 'exit' && movementData.quantity > targetProduct.currentStock) {
      return {
        success: false,
        message: `RN01 - Saldo insuficiente: Quantidade solicitada (${movementData.quantity}) excede o saldo físico disponível (${targetProduct.currentStock} un).`,
      };
    }

    const now = new Date();
    const dateStr = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const newMovement: StockMovement = {
      ...movementData,
      id: `mov-${Date.now()}`,
      date: dateStr,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === targetProduct.id) {
          const updatedStock =
            movementData.type === 'entry'
              ? p.currentStock + movementData.quantity
              : p.currentStock - movementData.quantity;

          const updatedSoldCount =
            movementData.type === 'exit'
              ? (p.soldCount || 0) + movementData.quantity
              : p.soldCount;

          const updatedRevenue =
            movementData.type === 'exit'
              ? (p.revenue || 0) + (movementData.quantity * p.sellingPrice)
              : p.revenue;

          return {
            ...p,
            currentStock: Math.max(0, updatedStock),
            soldCount: updatedSoldCount,
            revenue: updatedRevenue,
          };
        }
        return p;
      })
    );

    setMovements((prev) => [newMovement, ...prev]);
    return { success: true };
  };

  // Ajuste rápido (+1 / -1) pela tabela
  const handleQuickStockChange = (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (delta < 0 && prod.currentStock <= 0) return;

    handleRegisterMovement({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      type: delta > 0 ? 'entry' : 'exit',
      quantity: 1,
      reason: delta > 0 ? 'Entrada Rápida via Tabela' : 'Saída Rápida via Tabela',
      user: user?.name || 'Carlos Souza',
    });
  };

  // Salvar produto (novo ou edição)
  const handleSaveProduct = (productData: Omit<Product, 'id'>, editId?: string) => {
    if (editId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? { ...productData, id: editId } : p))
      );
    } else {
      const newProd: Product = {
        ...productData,
        id: Date.now().toString(),
      };
      setProducts((prev) => [newProd, ...prev]);

      if (newProd.currentStock > 0) {
        const now = new Date();
        setMovements((prev) => [
          {
            id: `mov-${Date.now()}`,
            productId: newProd.id,
            productName: newProd.name,
            sku: newProd.sku,
            type: 'entry',
            quantity: newProd.currentStock,
            date: `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            reason: 'Cadastro Inicial de Produto',
            user: user?.name || 'Carlos Souza',
          },
          ...prev,
        ]);
      }
    }
  };

  // Excluir produto
  const handleDeleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (window.confirm(`Tem certeza que deseja excluir o produto "${prod?.name || id}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // RN03: Ajuste manual
  const handleManualAdjustment = (productId: string, newStock: number, reason: string): boolean => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return false;

    const diff = newStock - targetProduct.currentStock;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const adjustmentRecord: StockMovement = {
      id: `adj-${Date.now()}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      type: diff >= 0 ? 'entry' : 'exit',
      quantity: Math.abs(diff),
      date: dateStr,
      reason: `Ajuste Manual Autorizado (RN03): ${reason}`,
      user: user?.name || 'Carlos Souza',
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, currentStock: newStock } : p))
    );

    setMovements((prev) => [adjustmentRecord, ...prev]);
    return true;
  };

  // Limpar todos os dados
  const handleClearAllData = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os produtos e movimentações? Esta ação deixará o sistema totalmente limpo.')) {
      setProducts([]);
      setMovements([]);
      localStorage.setItem('stockflow_products', JSON.stringify([]));
      localStorage.setItem('stockflow_movements', JSON.stringify([]));
      alert('Todos os dados foram limpos com sucesso!');
    }
  };

  // Restaurar dados de demonstração
  const handleLoadSampleData = () => {
    if (window.confirm('Deseja carregar os dados de demonstração do StockFlow para testes?')) {
      setProducts(sampleProducts);
      setMovements(sampleMovements);
      alert('Dados de demonstração carregados com sucesso!');
    }
  };

  // Exportar Excel
  const handleExportExcel = () => {
    const headers = ['SKU', 'Nome do Produto', 'Categoria', 'Saldo Atual', 'Estoque Mínimo', 'Localização', 'Preço Venda (R$)', 'Preço Custo (R$)', 'Validade', 'Status'];
    const rows = products.map((p) => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.currentStock,
      p.minStock,
      `"${p.location}"`,
      p.sellingPrice.toFixed(2).replace('.', ','),
      p.costPrice.toFixed(2).replace('.', ','),
      p.expiryDate || 'N/A',
      p.currentStock <= 0 ? 'Sem Estoque' : p.currentStock <= p.minStock ? 'Estoque Baixo' : 'Regular',
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `StockFlow_Inventario_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exibir a Tela de Login se não estiver autenticado
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] text-slate-800 font-sans">
      {/* Sidebar StockFlow */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        alertCount={alertCount}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          alertCount={alertCount}
          products={products}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNewMovement={() => setActiveTab('entries')}
          onExport={handleExportExcel}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Telas dinâmicas */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              movements={movements}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddProduct={() => setActiveTab('product-create')}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setIsProductModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onQuickStockChange={handleQuickStockChange}
              onExportExcel={handleExportExcel}
            />
          )}

          {activeTab === 'product-create' && (
            <ProductFormView
              onSaveProduct={handleSaveProduct}
              recentProducts={products}
              onNavigateToInventory={() => setActiveTab('inventory')}
            />
          )}

          {activeTab === 'entries' && (
            <MovementsView
              type="entry"
              products={products}
              movements={movements}
              onRegisterMovement={handleRegisterMovement}
            />
          )}

          {activeTab === 'exits' && (
            <MovementsView
              type="exit"
              products={products}
              movements={movements}
              onRegisterMovement={handleRegisterMovement}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              products={products}
              onRestock={(product) => {
                setActiveTab('entries');
              }}
            />
          )}

          {activeTab === 'management' && (
            <ManagementView
              products={products}
              onManualAdjustment={handleManualAdjustment}
              movements={movements}
              onClearAllData={handleClearAllData}
              onLoadSampleData={handleLoadSampleData}
            />
          )}
        </main>
      </div>

      {/* Modal de Cadastro / Edição */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Modal de Perfil de Usuário */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
      />
    </div>
  );
}
