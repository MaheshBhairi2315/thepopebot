'use client';

import { useState, useEffect } from 'react';
import {
  Coffee,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Star,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Heart,
  Award,
  Leaf,
} from 'lucide-react';

export default function CoffeeShop() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('coffee');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const menuCategories = {
    coffee: [
      { name: 'Signature Espresso', price: '$4.50', desc: 'Rich, bold double shot with caramel notes' },
      { name: 'Vanilla Bean Latte', price: '$5.75', desc: 'House-made vanilla, steamed milk, espresso' },
      { name: 'Caramel Macchiato', price: '$6.00', desc: 'Layered espresso, vanilla, caramel drizzle' },
      { name: 'Cold Brew Reserve', price: '$5.50', desc: '24-hour steep, smooth and refreshing' },
      { name: 'Nitro Cold Brew', price: '$6.50', desc: 'Velvety texture, natural sweetness' },
      { name: 'Oat Milk Cappuccino', price: '$5.50', desc: 'Creamy oat milk, perfect foam art' },
    ],
    pastries: [
      { name: 'Almond Croissant', price: '$4.75', desc: 'Flaky layers, almond cream filling' },
      { name: 'Blueberry Scone', price: '$3.95', desc: 'Fresh berries, lemon glaze' },
      { name: 'Chocolate Muffin', price: '$3.75', desc: 'Belgian chocolate chunks, moist center' },
      { name: 'Cinnamon Roll', price: '$4.50', desc: 'House-made caramel, pecan topping' },
      { name: 'Avocado Toast', price: '$8.95', desc: 'Sourdough, radish, microgreens, chili flakes' },
      { name: 'Breakfast Burrito', price: '$9.50', desc: 'Eggs, cheese, salsa verde, potatoes' },
    ],
    tea: [
      { name: 'Matcha Latte', price: '$5.75', desc: 'Ceremonial grade, oat milk option' },
      { name: 'Chai Tea Latte', price: '$5.25', desc: 'House blend spices, honey sweetened' },
      { name: 'Earl Grey Cream', price: '$4.50', desc: 'Bergamot, vanilla, steamed milk' },
      { name: 'Jasmine Green', price: '$4.00', desc: 'Premium loose leaf, floral notes' },
    ],
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-stone-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}>
                Brew Haven
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'About', 'Menu', 'Gallery', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                    isScrolled ? 'text-stone-200' : 'text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('menu')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
              >
                Order Online
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 border-t border-stone-800">
            <div className="px-4 py-4 space-y-3">
              {['Home', 'About', 'Menu', 'Gallery', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-stone-200 hover:text-amber-400 py-2 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 border border-amber-600/30 rounded-full">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">Award-Winning Coffee</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Where Every Cup
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
              Tells a Story
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Artisan coffee crafted with passion. Experience the perfect blend of tradition and innovation in every sip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('menu')}
              className="group bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              View Menu
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {[
                { value: '15+', label: 'Coffee Varieties' },
                { value: '50K+', label: 'Happy Customers' },
                { value: '10', label: 'Years Experience' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-amber-400">{stat.value}</div>
                  <div className="text-xs md:text-sm text-stone-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-stone-200">
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Coffee className="w-32 h-32 text-amber-600 mx-auto mb-6" />
                    <p className="text-stone-600 text-lg">Beautiful latte art illustration</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-amber-600 text-white p-6 rounded-2xl shadow-xl">
                <Award className="w-10 h-10 mb-2" />
                <div className="text-3xl font-bold">2019</div>
                <div className="text-amber-100 text-sm">Best Local Cafe</div>
              </div>
            </div>
            <div>
              <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mt-3 mb-6">
                Passion in Every Pour
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                Founded in 2014, Brew Haven began with a simple mission: to serve exceptional coffee that connects people. 
                Our beans are ethically sourced from sustainable farms across Ethiopia, Colombia, and Guatemala.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Every cup is crafted by our expertly trained baristas who understand that coffee is more than a beverage—
                it&apos;s an experience. From our signature espresso to our seasonal specialties, we pour our heart into every drink.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Leaf, title: 'Sustainable', desc: '100% ethical sourcing' },
                  { icon: Heart, title: 'Community', desc: 'Locally owned & operated' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">{feature.title}</h3>
                      <p className="text-sm text-stone-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase">Our Menu</span>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mt-3 mb-4">
              Crafted with Love
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              From classic espresso drinks to creative seasonal specials, discover your new favorite beverage.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {Object.keys(menuCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {menuCategories[activeCategory].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-stone-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-stone-900 text-lg group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-bold text-amber-600 text-lg">{item.price}</span>
                </div>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-stone-500 text-sm mb-4">* Alternative milk options available: Oat, Almond, Soy (+$0.75)</p>
            <button className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              View Full Menu
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase">Gallery</span>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mt-3 mb-4">
              Moments at Brew Haven
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { color: 'bg-amber-100', icon: Coffee, label: 'Latte Art' },
              { color: 'bg-orange-100', icon: Heart, label: 'Cozy Vibes' },
              { color: 'bg-stone-200', icon: Award, label: 'Premium Beans' },
              { color: 'bg-amber-50', icon: Leaf, label: 'Fresh Pastries' },
              { color: 'bg-stone-100', icon: Star, label: 'Community' },
              { color: 'bg-orange-50', icon: Clock, label: 'Morning Rush' },
              { color: 'bg-amber-200', icon: MapPin, label: 'Our Space' },
              { color: 'bg-stone-300', icon: Phone, label: 'Events' },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.color} aspect-square rounded-2xl flex flex-col items-center justify-center group hover:scale-105 transition-transform cursor-pointer`}
              >
                <item.icon className="w-10 h-10 text-stone-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-stone-700 font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm tracking-wider uppercase">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "The best coffee in the city! The atmosphere is warm and inviting, perfect for both work meetings and catching up with friends.",
                name: "Sarah Mitchell",
                role: "Regular Customer",
                rating: 5,
              },
              {
                text: "I drive 20 minutes just for their vanilla bean latte. Absolutely worth it every single time. The staff remembers my name!",
                name: "James Chen",
                role: "Coffee Enthusiast",
                rating: 5,
              },
              {
                text: "Finally found a place that understands oat milk! Their attention to detail and quality is unmatched. My new favorite spot.",
                name: "Emma Rodriguez",
                role: "Local Resident",
                rating: 5,
              },
            ].map((review, i) => (
              <div key={i} className="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-700">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-300 mb-6 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-sm text-stone-500">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase">Visit Us</span>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mt-3 mb-6">
                Stop By & Say Hello
              </h2>
              <p className="text-stone-600 text-lg mb-8">
                We&apos;d love to meet you! Come experience the Brew Haven difference in person.
              </p>

              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Address', content: '123 Coffee Lane, Downtown District\nPortland, OR 97201' },
                  { icon: Clock, title: 'Hours', content: 'Mon-Fri: 6:00 AM - 8:00 PM\nSat-Sun: 7:00 AM - 9:00 PM' },
                  { icon: Phone, title: 'Contact', content: '(503) 555-BREW\nhello@brewhaven.com' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900 mb-1">{item.title}</h3>
                      <p className="text-stone-600 whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors text-stone-600"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Join Our Coffee Club</h3>
              <p className="text-stone-600 mb-6">
                Subscribe for exclusive offers, brewing tips, and early access to seasonal drinks.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-stone-400 mt-4 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Brew Haven</span>
              </div>
              <p className="text-stone-500 max-w-sm">
                Crafting exceptional coffee experiences since 2014. Locally owned, community loved.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Menu', 'About Us', 'Locations', 'Careers'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-amber-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {['Contact', 'Gift Cards', 'Catering', 'FAQ'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-amber-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 Brew Haven Coffee Co. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}