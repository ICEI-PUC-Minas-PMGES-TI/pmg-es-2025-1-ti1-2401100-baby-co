document.addEventListener('DOMContentLoaded', () => {
  const data = {
    logo: 'logo.jpg',
    menu:
      [
        {
          acMenu: 'Bebês',
          link: 'babyProfile.html'
        }, {
          acMenu: 'Nutrição',
          link: ''
        }, {
          acMenu: 'Blogs',
          link: 'artigos.html'
        }, {
          acMenu: 'Lembretes',
          link: 'reminders.html'
        }, {
          acMenu: 'Login',
          link: 'login.html'
        }
      ],
    banner: {
      titulo: 'BabyConnect: Conectando você ao cuidado, do primeiro choro ao primeiro passo!',
      botaoTexto: 'Saiba Mais',
      imagem: 'banner.png'
    },
    galeria: ['../public/assets/images/familia_praia.png', '../public/assets/images/crianca_brincando.png', '../public/assets/images/familia_em_casa.png', '../public/assets/images/cidade_passeio.png']
  };

  // Menu
  const menuList = document.getElementById('menu-list');
  if (menuList) {
    menuList.innerHTML = '';
    data.menu.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = item.acMenu;
      a.href = item.link;
      li.appendChild(a);
      menuList.appendChild(li);
    });
  }

  // Banner
  const bannerTitle = document.getElementById('banner-title');
  if (bannerTitle) {
    bannerTitle.textContent = data.banner.titulo;
    const btn = document.getElementById('banner-button');
    btn.textContent = data.banner.botaoTexto;
    document.getElementById('banner-img').src = `../public/assets/images/${data.banner.imagem}`;
    btn.addEventListener('click', () => {
      const servSection = document.querySelector('.services');
      if (servSection) servSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Serviços (home)
  const servicesContainer = document.getElementById('services-container');
  if (servicesContainer) {
    fetch('http://localhost:3000/servicos')
      .then(res => res.json())
      .then(servicos => {
        servicos.forEach(svc => {
          const div = document.createElement('div');
          div.classList.add('service-item');
          div.innerHTML = `<h3>${svc.titulo}</h3><p>${svc.descricao}</p>`;
          servicesContainer.appendChild(div);
        });
      });
  }

  // Depoimentos (home)
  const testContainer = document.getElementById('testimonials-container');
  if (testContainer) {
    fetch('http://localhost:3000/depoimentos')
      .then(res => res.json())
      .then(deps => {
        deps.forEach(dep => {
          const div = document.createElement('div');
          div.classList.add('testimonial');
          div.innerHTML = `<p>"${dep.texto}"</p><img src="../public/assets/images/${dep.imagem}" alt="Usuário">`;
          testContainer.appendChild(div);
        });
      });
  }

  // Galeria
  const gallery = document.getElementById('gallery-container');
  if (gallery) {
    data.galeria.forEach(img => {
      const el = document.createElement('img');
      el.src = img;
      el.alt = 'Galeria';
      gallery.appendChild(el);
    });
  }
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

// mmostra o dropdown do user caso esteja logado
if (menuList) {
  menuList.innerHTML = '';
  data.menu.forEach(item => {
    const li = document.createElement('li');

    // Se for o item Login e houver usuário logado, substitui por dropdown
    if (item.acMenu === 'Login' && usuario) {
      li.innerHTML = `
        <div class="dropdown-wrapper">
          <a class="dropdown-trigger">Olá, ${usuario.nome}</a>
          <div class="dropdown-content">
            <div class="dropdown-item" data-link="perfil.html">Meu Perfil</div>
            <div class="dropdown-item" id="logoutBtn">Sair</div>
          </div>
        </div>
      `;
    } else {
      const a = document.createElement('a');
      a.textContent = item.acMenu;
      a.href = item.link;
      li.appendChild(a);
    }

    menuList.appendChild(li);
  });

  // Evento logout
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('usuario');
    location.reload();
  });

  // Eventos de clique para redirecionar dropdown
  document.querySelectorAll('.dropdown-item[data-link]')?.forEach(item => {
    item.addEventListener('click', () => {
      window.location.href = item.dataset.link;
    });
  });
}

});