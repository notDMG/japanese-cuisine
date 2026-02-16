interface TItem {
  label: string,
  href: string
}

interface IContent {
  content: string;
}

interface ISiteConf {
  title: string;
  description: string;
  navItems: TItem[];
  pageContent: Record<string, IContent>
}

export const siteConf: ISiteConf = { 
  title: 'Japanese food',
  description: 'Cool Japanese food',
  navItems : [
    { label: 'Recipes', href: '/recipes' },
    { label: 'Ingredients', href: '/ingredients' },
    { label: 'About Us', href: '/about' },
  ],
  pageContent: {
    '/': {content: 'blablablabla'},
    '/recipes': {content: 'blablablabla'},
    '/ingredients': {content: '3'},
    '/about': {content: `
      <section class="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 class="text-3xl font-bold text-orange-600 mb-6">About Our Japanese Culinary Journey</h1>
        
        <p class="text-lg leading-relaxed mb-4">
          Welcome to our sanctuary of Japanese gastronomy, where tradition meets modern culinary art. Our mission is to share the profound philosophy and exquisite flavors of <strong>Washoku</strong> (traditional Japanese cuisine) with food enthusiasts around the world.
        </p>

        <div class="grid md:grid-cols-2 gap-8 my-10">
          <div class="border-l-4 border-orange-500 pl-4">
            <h2 class="text-xl font-semibold mb-2">Our Philosophy</h2>
            <p class="text-gray-600">
              We believe in the beauty of simplicity and the importance of seasonality. Every recipe and ingredient in our collection is chosen to respect the natural taste of food, following the principles of balance and harmony.
            </p>
          </div>
          
          <div class="border-l-4 border-orange-500 pl-4">
            <h2 class="text-xl font-semibold mb-2">Authentic Recipes</h2>
            <p class="text-gray-600">
              From the delicate precision of Sushi to the comforting warmth of Ramen, we provide step-by-step guides curated by experts to help you recreate the authentic taste of Japan in your own kitchen.
            </p>
          </div>
        </div>

        <h2 class="text-2xl font-bold mb-4">Why Japanese Cuisine?</h2>
        <p class="mb-6">
          Japanese cuisine is not just about food; it is a cultural experience recognized by UNESCO as an Intangible Cultural Heritage. It promotes health, longevity, and a deep appreciation for the aesthetic presentation of dishes.
        </p>

        <footer class="bg-gray-50 p-6 rounded-lg text-center italic">
          "To eat is to live, and to eat well is to live fully." 
          <br>Join us as we explore the endless horizons of Japanese flavors.
        </footer>
      </section>
    `},
  }
}