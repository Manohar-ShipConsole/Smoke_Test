

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#login_userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login_login');

    //this.welcometext = page.locator('h1:has-text("Welcome")');
    this.welcometext = page.locator('h3.text-left', { hasText: 'Welcome' });


  }

  async loginWithCredentials(username, password) {
    await this.usernameInput.waitFor(); // Added safety
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

  }
}