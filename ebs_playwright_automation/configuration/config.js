const config = {
  // Pre Prod:
  // baseURL: 'https://cloudscmtest.shipconsole.com/ShipConsoleCloud/',
  // username: 'SCQAM1',
  // password: 'Welcome@18',
  // printerName: 'ZDesigner ZD230-203dpi ZPL'

  // Prod:
  baseURL: 'https://cloud.shipconsole.com/ShipConsoleCloud/',
  username: 'Sconsole1',
  password: '$ConsolE@26',
  printerName: 'ZDesigner ZD230-203dpi ZPL',

  // Environment Validation Credentials
  credentials: {
    shipConsoleJDE: {
      username: 'apps1',
      password: 'C0n$olE@1029'
    },
    ltlConsole: {
      username: 'SHIPCONSOLE',
      password: 'SHIPCONSOLE'
    },
    saasServices: {
      username: 'apps1',
      password: 'apps123'
    },
    labcorp: {
      username: 'admin@labcorp.com',
      password: 'Welcome1@'
    }
  }

};

export default config;