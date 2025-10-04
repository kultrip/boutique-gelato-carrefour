type Language = 'en' | 'es' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    pt: string;
  };
}

const translations: Translations = {
  // Auth
  'auth.login': { en: 'Log In', es: 'Iniciar Sesión', pt: 'Entrar' },
  'auth.signup': { en: 'Sign Up', es: 'Registrarse', pt: 'Registrar' },
  'auth.email': { en: 'Email', es: 'Correo electrónico', pt: 'Email' },
  'auth.password': { en: 'Password', es: 'Contraseña', pt: 'Senha' },
  'auth.fullName': { en: 'Full Name', es: 'Nombre completo', pt: 'Nome completo' },
  'auth.logout': { en: 'Log Out', es: 'Cerrar Sesión', pt: 'Sair' },
  'auth.welcome': { en: 'Welcome', es: 'Bienvenido', pt: 'Bem-vindo' },
  
  // Navigation
  'nav.dashboard': { en: 'Dashboard', es: 'Panel', pt: 'Painel' },
  'nav.orders': { en: 'New Order', es: 'Nueva Orden', pt: 'Novo Pedido' },
  'nav.products': { en: 'Products', es: 'Productos', pt: 'Produtos' },
  'nav.settings': { en: 'Settings', es: 'Configuración', pt: 'Configurações' },
  
  // Products
  'products.title': { en: 'Products', es: 'Productos', pt: 'Produtos' },
  'products.add': { en: 'Add Product', es: 'Agregar Producto', pt: 'Adicionar Produto' },
  'products.edit': { en: 'Edit Product', es: 'Editar Producto', pt: 'Editar Produto' },
  'products.name': { en: 'Name', es: 'Nombre', pt: 'Nome' },
  'products.category': { en: 'Category', es: 'Categoría', pt: 'Categoria' },
  'products.price': { en: 'Price', es: 'Precio', pt: 'Preço' },
  'products.description': { en: 'Description', es: 'Descripción', pt: 'Descrição' },
  'products.save': { en: 'Save', es: 'Guardar', pt: 'Salvar' },
  'products.cancel': { en: 'Cancel', es: 'Cancelar', pt: 'Cancelar' },
  'products.delete': { en: 'Delete', es: 'Eliminar', pt: 'Excluir' },
  
  // Orders
  'orders.title': { en: 'New Order', es: 'Nueva Orden', pt: 'Novo Pedido' },
  'orders.addItem': { en: 'Add Item', es: 'Agregar Artículo', pt: 'Adicionar Item' },
  'orders.subtotal': { en: 'Subtotal', es: 'Subtotal', pt: 'Subtotal' },
  'orders.tax': { en: 'Tax', es: 'Impuesto', pt: 'Imposto' },
  'orders.total': { en: 'Total', es: 'Total', pt: 'Total' },
  'orders.print': { en: 'Print Receipt', es: 'Imprimir Recibo', pt: 'Imprimir Recibo' },
  'orders.clear': { en: 'Clear Order', es: 'Limpiar Orden', pt: 'Limpar Pedido' },
  'orders.quantity': { en: 'Quantity', es: 'Cantidad', pt: 'Quantidade' },
  'orders.empty': { en: 'No items in order', es: 'Sin artículos en la orden', pt: 'Sem itens no pedido' },
  
  // Settings
  'settings.title': { en: 'Shop Settings', es: 'Configuración de Tienda', pt: 'Configurações da Loja' },
  'settings.shopName': { en: 'Shop Name', es: 'Nombre de la Tienda', pt: 'Nome da Loja' },
  'settings.address': { en: 'Address', es: 'Dirección', pt: 'Endereço' },
  'settings.phone': { en: 'Phone', es: 'Teléfono', pt: 'Telefone' },
  'settings.printerIP': { en: 'Printer IP', es: 'IP de Impresora', pt: 'IP da Impressora' },
  'settings.printerName': { en: 'Printer Name', es: 'Nombre de Impresora', pt: 'Nome da Impressora' },
  
  // Common
  'common.save': { en: 'Save', es: 'Guardar', pt: 'Salvar' },
  'common.cancel': { en: 'Cancel', es: 'Cancelar', pt: 'Cancelar' },
  'common.delete': { en: 'Delete', es: 'Eliminar', pt: 'Excluir' },
  'common.edit': { en: 'Edit', es: 'Editar', pt: 'Editar' },
  'common.loading': { en: 'Loading...', es: 'Cargando...', pt: 'Carregando...' },
  'common.thankYou': { en: 'Thank you!', es: '¡Gracias!', pt: 'Obrigado!' },
};

export const getLanguage = (): Language => {
  const stored = localStorage.getItem('language') as Language;
  return stored || 'en';
};

export const setLanguage = (lang: Language) => {
  localStorage.setItem('language', lang);
};

export const t = (key: string): string => {
  const lang = getLanguage();
  return translations[key]?.[lang] || key;
};
