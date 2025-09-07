/* ===== Utilities (Storage) ===== */
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

/* ===== Sidebar ===== */
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => { sidebar.classList.add('show'); overlay.classList.add('show'); });
overlay.addEventListener('click', () => { sidebar.classList.remove('show'); overlay.classList.remove('show'); });

/* ===== Location Dropdown ===== */
const locationDropdown = document.getElementById('locationDropdown');
const currentLocation = document.getElementById('currentLocation');
const pinInput = document.getElementById('pinInput');
const savePin = document.getElementById('savePin');

function setLocation(pin) {
  if(!pin) return;
  store.set('pin', pin);
  currentLocation.textContent = `PIN ${pin}`;
  pinInput.value = '';
}
function applySavedLocation(){
  const saved = store.get('pin', null);
  if(saved) currentLocation.textContent = `PIN ${saved}`;
}
applySavedLocation();

locationDropdown.addEventListener('click', (e)=>{
  const panel = e.target.closest('.dropdown-menu');
  if(panel) return;
  locationDropdown.classList.toggle('show');
  langDropdown.classList.remove('show');
});
savePin.addEventListener('click', ()=> setLocation(pinInput.value.trim()));
document.querySelectorAll('.chip-pin').forEach(btn=>{
  btn.addEventListener('click', ()=> setLocation(btn.dataset.pin));
});

// click outside to close dd
document.addEventListener('click', (e)=>{
  if(!locationDropdown.contains(e.target) && !langDropdown.contains(e.target)){
    locationDropdown.classList.remove('show');
    langDropdown.classList.remove('show');
  }
});

/* ===== Language Dropdown ===== */
const langDropdown = document.getElementById('langDropdown');
const currentLang = document.getElementById('currentLang');
const saveLang = document.getElementById('saveLang');

function applySavedLang(){
  const l = store.get('lang', 'EN');
  currentLang.textContent = l;
  const radio = document.querySelector(`input[name="lang"][value="${l}"]`);
  if(radio) radio.checked = true;
}
applySavedLang();

langDropdown.addEventListener('click', (e)=>{
  const panel = e.target.closest('.dropdown-menu');
  if(panel && e.target.id !== 'saveLang') return;
  langDropdown.classList.toggle('show');
  locationDropdown.classList.remove('show');
});
saveLang.addEventListener('click', ()=>{
  const sel = document.querySelector('input[name="lang"]:checked')?.value || 'EN';
  store.set('lang', sel);
  currentLang.textContent = sel;
  langDropdown.classList.remove('show');
});

/* ===== Search (Category-aware) ===== */
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const productGrid = document.getElementById('productGrid');

searchForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  filterProducts();
});
document.getElementById('searchBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  filterProducts();
});
searchInput.addEventListener('keypress',(e)=>{
  if(e.key==="Enter"){ e.preventDefault(); filterProducts(); }
});

function filterProducts(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const cards = productGrid.querySelectorAll('.card');
  let shown = 0;
  cards.forEach(card=>{
    const title = card.querySelector('h3').textContent.toLowerCase();
    const c = card.dataset.category;
    const matchText = !q || title.includes(q);
    const matchCat = cat === 'all' || c === cat;
    const show = matchText && matchCat;
    card.style.display = show ? '' : 'none';
    if(show) shown++;
  });
  if(shown===0) alert('No products match your search.');
}

/* ===== Simple Auth State (for Sidebar buttons) ===== */
const sideHello = document.getElementById('sideHello');
const sideSignIn = document.getElementById('sideSignIn');
const sideSignOut = document.getElementById('sideSignOut');

function applyAuthUI(){
  const user = store.get('user', null);
  if(user){
    sideHello.innerHTML = `<i class="fa-solid fa-user"></i> Hello, ${user.name || 'User'}`;
    sideSignIn.style.display = 'none';
    sideSignOut.style.display = 'inline-block';
  }else{
    sideHello.innerHTML = `<i class="fa-solid fa-user"></i> Hello, Guest`;
    sideSignIn.style.display = 'inline-block';
    sideSignOut.style.display = 'none';
  }
}
applyAuthUI();

/* ===== Auth Modal ===== */
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const doSignin = document.getElementById('doSignin');

sideSignIn.addEventListener('click', ()=> authModal.classList.add('show'));
closeModal.addEventListener('click', ()=> authModal.classList.remove('show'));
authModal.addEventListener('click', (e)=> { if (e.target === authModal) authModal.classList.remove('show'); });

doSignin.addEventListener('click', ()=>{
  const email = document.getElementById('email').value.trim();
  if(!email){ alert('Enter email'); return; }
  store.set('user', {email, name: email.split('@')[0]});
  authModal.classList.remove('show');
  applyAuthUI();
});

sideSignOut.addEventListener('click', ()=>{
  localStorage.removeItem('user');
  applyAuthUI();
});

/* ===== Sidebar Accordion ===== */
document.querySelectorAll('.acc-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = document.querySelector(btn.dataset.target);
    target?.classList.toggle('show');
    btn.querySelector('.fa-chevron-down')?.classList.toggle('rot');
  });
});

/* ===== Quick links open actions ===== */
document.getElementById('accWishlist')?.addEventListener('click', (e)=>{ e.preventDefault(); openWishlist.click(); });
document.getElementById('accCart')?.addEventListener('click', (e)=>{ e.preventDefault(); openCart.click(); });

/* ===== Hero Slider ===== */
const slides = document.getElementById('slides');
const dots = document.getElementById('dots');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const totalSlides = slides.children.length;
let index = 0;

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dots.appendChild(dot);
}
const updateDots = () => { [...dots.children].forEach((d, i) => d.classList.toggle('active', i === index)); };
const goToSlide = (i) => { index = (i + totalSlides) % totalSlides; slides.style.transform = `translateX(-${index * 100}%)`; updateDots(); };
next.addEventListener('click', () => goToSlide(index + 1));
prev.addEventListener('click', () => goToSlide(index - 1));
setInterval(() => goToSlide(index + 1), 4000);

/* ===== Back to top ===== */
document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Cart & Wishlist State ===== */
const cartBadge = document.getElementById('cartCount');
const wishBadge = document.getElementById('wishCount');
let cart = store.get('cart', []);       // [{id,name,price,qty}]
let wishlist = store.get('wishlist', []); // [{id,name,price}]

function syncBadges(){
  const cartCount = cart.reduce((a,i)=>a+i.qty,0);
  cartBadge.textContent = String(cartCount);
  wishBadge.textContent = String(wishlist.length);
}
syncBadges();

/* ===== Add to Cart / Wishlist buttons ===== */
document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.id, name = btn.dataset.name, price = Number(btn.dataset.price);
    const found = cart.find(i=>i.id===id);
    if(found){ found.qty += 1; }
    else { cart.push({id,name,price,qty:1}); }
    store.set('cart', cart);
    syncBadges();
    flash(btn, "Added!");
  });
});

document.querySelectorAll('.add-to-wish').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.id, name = btn.dataset.name, price = Number(btn.dataset.price);
    if(!wishlist.find(i=>i.id===id)){
      wishlist.push({id,name,price});
      store.set('wishlist', wishlist);
      syncBadges();
      flash(btn, "Wishlisted ✓");
    } else {
      flash(btn, "Already in ♥");
    }
  });
});

function flash(btn, text){
  const prev = btn.innerHTML;
  btn.innerHTML = text;
  btn.disabled = true;
  setTimeout(()=>{ btn.innerHTML = prev; btn.disabled = false; }, 1200);
}

/* ===== Cart Modal ===== */
const cartModal = document.getElementById('cartModal');
const openCart = document.getElementById('openCart');
const closeCart = document.getElementById('closeCart');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');

openCart.addEventListener('click', ()=> { renderCart(); cartModal.classList.add('show'); });
closeCart.addEventListener('click', ()=> cartModal.classList.remove('show'));
cartModal.addEventListener('click', (e)=>{ if(e.target===cartModal) cartModal.classList.remove('show'); });

function renderCart(){
  cartList.innerHTML = '';
  if(cart.length===0){ cartList.innerHTML = '<div class="muted">Your cart is empty.</div>'; cartTotal.textContent='0'; return; }
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>₹ ${item.price}</small>
      </div>
      <div class="qty-row">
        <button data-act="dec" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button data-act="inc" data-id="${item.id}">+</button>
        <button class="mini-btn" data-act="rem" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartList.appendChild(row);
  });
  cartTotal.textContent = String(total);
}

cartList.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const act = btn.dataset.act;
  const item = cart.find(i=>i.id===id);
  if(!item) return;

  if(act==='inc') item.qty += 1;
  if(act==='dec'){ item.qty = Math.max(1, item.qty-1); }
  if(act==='rem'){ cart = cart.filter(i=>i.id!==id); }

  store.set('cart', cart);
  syncBadges();
  renderCart();
});

/* ===== Wishlist Modal ===== */
const wishlistModal = document.getElementById('wishlistModal');
const openWishlist = document.getElementById('openWishlist');
const closeWishlist = document.getElementById('closeWishlist');
const wishList = document.getElementById('wishList');

openWishlist.addEventListener('click', ()=>{ renderWishlist(); wishlistModal.classList.add('show'); });
closeWishlist.addEventListener('click', ()=> wishlistModal.classList.remove('show'));
wishlistModal.addEventListener('click', (e)=>{ if(e.target===wishlistModal) wishlistModal.classList.remove('show'); });

function renderWishlist(){
  wishList.innerHTML = '';
  if(wishlist.length===0){ wishList.innerHTML = '<div class="muted">Your wishlist is empty.</div>'; return; }
  wishlist.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>₹ ${item.price}</small>
      </div>
      <div class="qty-row">
        <button class="mini-btn" data-act="move" data-id="${item.id}">Add to Cart</button>
        <button class="mini-btn" data-act="rem" data-id="${item.id}">Remove</button>
      </div>
    `;
    wishList.appendChild(row);
  });
}

wishList.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const act = btn.dataset.act;
  const item = wishlist.find(i=>i.id===id);
  if(!item) return;

  if(act==='move'){
    const found = cart.find(c=>c.id===item.id);
    if(found) found.qty += 1; else cart.push({id:item.id,name:item.name,price:item.price,qty:1});
    wishlist = wishlist.filter(w=>w.id!==id);
  }
  if(act==='rem'){
    wishlist = wishlist.filter(w=>w.id!==id);
  }

  store.set('cart', cart);
  store.set('wishlist', wishlist);
  syncBadges();
  renderWishlist();
});

/* ===== OTP Checkout (Demo) ===== */
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(cart.length===0){ alert('Cart is empty.'); return; }
  const email = prompt('Enter Gmail address for OTP:');
  if(!email || !/^[\w.+-]+@gmail\.com$/i.test(email)){ alert('Please enter a valid Gmail address.'); return; }
  const otp = String(Math.floor(100000 + Math.random()*900000));
  alert(`Demo OTP sent to ${email}: ${otp}\n(This is a demo. No real email sent.)`);
  const entered = prompt('Enter OTP:');
  if(entered === otp){
    alert('Payment successful! (Demo)');
    cart = [];
    store.set('cart', cart);
    syncBadges();
    renderCart();
    cartModal.classList.remove('show');
  } else {
    alert('Invalid OTP.');
  }
});
