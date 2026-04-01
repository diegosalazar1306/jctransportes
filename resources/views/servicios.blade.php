<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Servicios - TRANSPORTES JC</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800" rel="stylesheet" />
    
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/inicio.css') }}?v=5">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="{{ route('inicio') }}" class="nav-logo">
                <img src="{{ asset('images/logo.png') }}" alt="TRANSPORTES JC Logo" class="logo-img" />
            </a>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="{{ route('inicio') }}" class="nav-link {{ request()->routeIs('inicio') ? 'active' : '' }}">Inicio</a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('acerca-de') }}" class="nav-link {{ request()->routeIs('acerca-de') ? 'active' : '' }}">Acerca de</a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('servicios') }}" class="nav-link {{ request()->routeIs('servicios') ? 'active' : '' }}">Servicios</a>
                </li>
            </ul>
            <a href="{{ route('inicio') }}#contacto" class="nav-cta">Presupuesto Gratis</a>
            <button class="nav-toggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <!-- Services Section -->
    <section class="content-section" style="padding-top: 8rem;">
        <h2 class="section-title">Nuestros Servicios</h2>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon">🚚</div>
                <h3 class="service-title">Carga en General</h3>
                <p class="service-description">
                    Servicio confiable de transporte de carga para empresas y particulares. 
                    Cubrimos rutas nacionales con la máxima seguridad y puntualidad.
                </p>
            </div>
            
            <div class="service-card">
                <div class="service-icon">📦</div>
                <h3 class="service-title">Carga Especializada</h3>
                <p class="service-description">
                    Transporte especializado para cargas que requieren cuidados específicos. 
                    Contamos con equipos y personal capacitado para cada tipo de mercancía.
                </p>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🚛</div>
                <h3 class="service-title">Exceso de Dimensiones</h3>
                <p class="service-description">
                    Especialistas en transporte de cargas de gran tamaño y peso. 
                    Soluciones logísticas para proyectos que requieren equipos especializados.
                </p>
            </div>
            
            <div class="service-card">
                <div class="service-icon">⚙️</div>
                <h3 class="service-title">Maquinaria</h3>
                <p class="service-description">
                    Transporte seguro de maquinaria pesada y equipos industriales. 
                    Contamos con vehículos especializados y personal experto.
                </p>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🌍</div>
                <h3 class="service-title">Rutas Nacionales</h3>
                <p class="service-description">
                    Cobertura en todo el territorio nacional. 
                    Llegamos a donde necesites con nuestros servicios de transporte.
                </p>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🛡️</div>
                <h3 class="service-title">Seguro de Carga</h3>
                <p class="service-description">
                    Todos nuestros envíos están protegidos con seguro de carga. 
                    Tu tranquilidad es nuestra prioridad.
                </p>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contacto" class="content-section">
        <div class="contact-section">
            <h2 class="contact-title">COTIZACIONES</h2>
            
            <!-- QR Code Section -->
            <div class="qr-container">
                <div class="qr-wrapper">
                    <img src="{{ asset('images/whatsapp-qr.png') }}" alt="QR Code de WhatsApp - Javier Vazquez" class="qr-image" />
                    <p class="qr-text">Escanea para contactarnos por WhatsApp</p>
                </div>
            </div>
            
            <div class="contact-info">
                <div class="contact-item">
                    <div class="contact-item-title">👤 Contacto</div>
                    <div class="contact-item-value">Javier Vazquez</div>
                </div>
                <div class="contact-item">
                    <div class="contact-item-title">📱 WhatsApp</div>
                    <div class="contact-item-value">
                        <a href="https://wa.me/523321547521" target="_blank">
                            33 21 54 75 21
                        </a>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-item-title">📧 Email</div>
                    <div class="contact-item-value">
                        <a href="mailto:jjaviervazquezc@hotmail.es">
                            jjaviervazquezc@hotmail.es
                        </a>
                    </div>
                </div>
            </div>
            <div class="contact-footer">
                <p class="contact-footer-text">
                    TRAMITES Y PERMISOS ANTE LA SCT
                </p>
            </div>
        </div>
    </section>
    
    <!-- Scripts -->
    <script src="{{ asset('js/inicio.js') }}"></script>
</body>
</html>

