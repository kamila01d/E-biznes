# Test file: test_functional_cart.py
from asyncio import sleep

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import unittest

class EcommerceFunctionalTests(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument("--disable-search-engine-choice-screen")
        self.driver = webdriver.Chrome(options=chrome_options)  # Ensure the correct path for the Chrome driver is set
        self.driver.get("http://localhost:3000")  # The URL for your frontend React app

    def test_load_home_page(self):
        driver = self.driver
        driver_header = driver.find_element(By.XPATH, "//h2[text()='Products']")
        self.assertIn("Products", driver_header.text)

    def test_load_home_page_buttons(self):
        driver = self.driver
        add_button = driver.find_element(By.XPATH, "//button[text()='Add to Cart']")
        self.assertIn("Add to Cart", add_button.text)
        clear_cart_button = driver.find_element(By.XPATH, "//button[text()='Clear The Cart']")
        self.assertIn("Clear The Cart", clear_cart_button.text)

    def test_add_product_to_cart(self):
        driver = self.driver
        add_button = driver.find_element(By.XPATH, "//button[text()='Add to Cart']")
        add_button.click()
        time.sleep(1)
        cart_button = driver.find_element(By.XPATH, "//button[text()='Go to Cart']")
        cart_button.click()
        self.assertIn("Your Cart", driver.page_source)

    def test_navigate_to_cart_page(self):
        driver = self.driver
        cart_button = driver.find_element(By.XPATH, "//button[text()='Go to Cart']")
        cart_button.click()
        time.sleep(1)
        cart_button = driver.find_element(By.XPATH, "//p[text()='No items in the cart.']")
        self.assertIn("No items in the cart", cart_button.text)

    def test_view_cart_total(self):
        driver = self.driver
        add_button = driver.find_element(By.XPATH, "//button[text()='Add to Cart']")
        add_button.click()
        time.sleep(1)
        driver.find_element(By.XPATH, "//button[text()='Go to Cart']").click()
        time.sleep(1)
        total = driver.find_element(By.XPATH, "//h3[contains(text(), 'Total')]")
        self.assertTrue(total)

    def test_remove_item_from_cart(self):
        driver = self.driver
        driver.find_element(By.XPATH, "//button[text()='Add to Cart']").click()
        time.sleep(1)
        driver.find_element(By.XPATH, "//button[text()='Go to Cart']").click()
        total = driver.find_element(By.XPATH, "//h3[contains(text(), 'Total')]")
        self.assertTrue(total)
        remove_button = driver.find_element(By.XPATH, "//button[text()='Clear Cart']")
        remove_button.click()
        time.sleep(1)
        cart_button = driver.find_element(By.XPATH, "//p[text()='No items in the cart.']")
        self.assertIn("No items in the cart", cart_button.text)

    def test_payment_process(self):
        driver = self.driver
        driver.find_element(By.XPATH, "//button[text()='Add to Cart']").click()
        time.sleep(1)
        driver.find_element(By.XPATH, "//button[text()='Go to Cart']").click()
        total = driver.find_element(By.XPATH, "//h3[contains(text(), 'Total')]")
        self.assertTrue(total)
        driver.find_element(By.XPATH, "//button[text()='Go to Payment']").click()
        payment_button = driver.find_element(By.XPATH, "//button[text()='Submit Payment']")
        payment_button.click()
        sleep(1)
        payment_successfull_header = driver.find_element(By.XPATH, "//h2[text()='Payment Successful!']")
        self.assertIn("Payment Successful!", payment_successfull_header.text)
        payment_paragraph = driver.find_element(By.XPATH, "//p[text()='Your payment has been processed successfully.']")
        self.assertIn("Your payment has been processed successfully.", payment_paragraph.text)
        return_to_home_page_button = driver.find_element(By.XPATH, "//button[text()='Navigate to Home Page']")
        self.assertIn("Navigate to Home Page", return_to_home_page_button.text)
        return_to_home_page_button.click()
        driver_header = driver.find_element(By.XPATH, "//h2[text()='Products']")
        self.assertIn("Products", driver_header.text)
        add_button = driver.find_element(By.XPATH, "//button[text()='Add to Cart']")
        self.assertIn("Add to Cart", add_button.text)
        clear_cart_button = driver.find_element(By.XPATH, "//button[text()='Clear The Cart']")
        self.assertIn("Clear The Cart", clear_cart_button.text)

    # More tests can be added here

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
