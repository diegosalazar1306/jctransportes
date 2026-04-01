<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acerca de - TRANSPORTES JC</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800" rel="stylesheet" />
    
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/inicio.css') }}?v=4">
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

    <!-- About Hero Section with Image -->
    <section class="about-hero-section">
        <div class="about-hero-overlay"></div>
        <div class="about-hero-content">
            <div class="about-hero-text">
                <h1 class="about-hero-title">Acerca de</h1>
                <h2 class="about-hero-subtitle">TRANSPORT<wbr>ES<br>JC</h2>
            </div>
            <div class="about-hero-description">
                <p>
                    Somos una empresa de transporte, fletes y mudanzas comprometida con brindar un servicio 
                    de alta calidad y confiabilidad. En TRANSPORTES JC, nos esforzamos por ofrecer soluciones 
                    de transporte seguras y eficientes para satisfacer las necesidades de nuestros clientes.
                </p>
                <p>
                    Nuestro equipo altamente capacitado está dedicado a hacer que cada experiencia de transporte 
                    sea sin complicaciones y satisfactoria. Con TRANSPORTES JC, puedes confiar en un servicio 
                    confiable y profesional que se adapta a tus necesidades de transporte y mudanza.
                </p>
            </div>
        </div>
    </section>

    <!-- About Details Section -->
    <section class="content-section" style="padding-top: 5rem;">
        <h2 class="section-title">Nuestros Valores</h2>
        
        <div class="values-grid">
            <div class="value-card">
                <div class="value-icon">🛡️</div>
                <h3 class="value-title">Seguridad</h3>
                <p class="value-description">
                    Priorizamos la seguridad en cada viaje y transporte. Tu carga está en las mejores manos.
                </p>
            </div>
            
            <div class="value-card">
                <div class="value-icon">🤝</div>
                <h3 class="value-title">Confianza</h3>
                <p class="value-description">
                    Construimos relaciones duraderas basadas en la confianza y el compromiso con nuestros clientes.
                </p>
            </div>
            
            <div class="value-card">
                <div class="value-icon">⚡</div>
                <h3 class="value-title">Rapidez</h3>
                <p class="value-description">
                    Entregas puntuales y eficientes. Cumplimos con los tiempos acordados sin comprometer la calidad.
                </p>
            </div>
        </div>

        <div class="certification-card">
            <h3 class="service-title" style="margin-bottom: 1.5rem;">Experiencia y Certificaciones</h3>
            <p class="service-description" style="font-size: 1.1rem; line-height: 1.8;">
                Contamos con todos los permisos y certificaciones necesarias ante la SCT (Secretaría de 
                Comunicaciones y Transportes), garantizando que nuestros servicios cumplen con todas las 
                normativas y estándares de seguridad requeridos.
            </p>
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

