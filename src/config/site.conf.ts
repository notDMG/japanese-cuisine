interface Item {
  label: string,
  href: string
}

interface ISiteConf {
  title: string;
  description: string;
  navItems: Item[]
}

export const SiteConf:ISiteConf = { 
  title: 'Japanese food',
  description: 'Cool Japanese food',
  navItems : [
    { label: 'Features', href: '/features' },
    { label: 'Customers', href: '/customers' },
    { label: 'Integrations', href: '/integrations' },
  ]
}