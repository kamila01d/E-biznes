from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import unittest
import time


class EcommerceFunctionalTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument("--disable-search-engine-choice-screen")
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.get("")

    def find_and_click(self, xpath, sleep_time=1):
        """Utility function to find an element by XPath and click on it."""
        element = self.driver.find_element(By.XPATH, xpath)
        element.click()
        time.sleep(sleep_time)
        return element

    def assert_element_text(self, xpath, expected_text):
        """Utility function to assert the text of an element."""
        element = self.driver.find_element(By.XPATH, xpath)
        self.assertIn(expected_text, element.text)
        return element

    def test_load_home_page(self):
        self.assert_element_text("//h2[text()='Products']", "Products")

    def test_load_home_page_buttons(self):
        self.assert_element_text("//button[text()='Add to Cart']", "Add to Cart")
        self.assert_element_text("//button[text()='Clear The Cart']", "Clear The Cart")

    def test_add_product_to_cart(self):
        self.find_and_click("//button[text()='Add to Cart']")
        self.find_and_click("//button[text()='Go to Cart']")
        self.assertIn("Your Cart", self.driver.page_source)

    def test_navigate_to_cart_page(self):
        self.find_and_click("//button[text()='Go to Cart']")
        self.assert_element_text("//p[text()='No items in the cart.']", "No items in the cart")

    def test_view_cart_total(self):
        self.find_and_click("//button[text()='Add to Cart']")
        self.find_and_click("//button[text()='Go to Cart']")
        total = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Total')]")
        self.assertTrue(total)

    def test_remove_item_from_cart(self):
        self.find_and_click("//button[text()='Add to Cart']")
        self.find_and_click("//button[text()='Go to Cart']")
        self.assertTrue(self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Total')]"))
        self.find_and_click("//button[text()='Clear Cart']")
        self.assert_element_text("//p[text()='No items in the cart.']", "No items in the cart")

