package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Product
import scala.collection.mutable
import scala.concurrent.ExecutionContext


case class Category(id: Long, name: String)

object Category {
  implicit val categoryFormat: Format[Category] = Json.format[Category]
}
@Singleton
class ProductController @Inject()(cc: ControllerComponents)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  private val products = mutable.ListBuffer[Product]()
  private val categories = mutable.ListBuffer[Category]()
  private val cart = mutable.Map[Long, Int]().withDefaultValue(0)


  def listProducts: Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }

  def getProduct(id: Long): Action[AnyContent] = Action {
    products.find(_.id.contains(id)) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("error" -> "Product not found"))
    }
  }

  def createProduct: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].fold(
      errors => BadRequest(Json.obj("error" -> JsError.toJson(errors))),
      product => {
        val newId = if (products.isEmpty) 1 else products.map(_.id.getOrElse(0L)).max + 1
        val newProduct = product.copy(id = Some(newId))
        products += newProduct
        categories.find(_.name == product.category) match {
          case Some(_) =>
          case None => categories += Category(categories.size + 1, product.category)
        }
        Created(Json.toJson(product))
      }
    )
  }

  def updateProduct(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].fold(
      errors => BadRequest(Json.obj("error" -> JsError.toJson(errors))),
      updatedProduct => {
        products.indexWhere(_.id.contains(id)) match {
          case -1 => NotFound(Json.obj("error" -> "Product not found"))
          case index =>
            val existingProduct = products(index)
            existingProduct.category.foreach { oldCategory =>
              if (!products.exists(p => p.category.contains(oldCategory) && p.id != Some(id))) {
                categories.indexWhere(_.name == oldCategory) match {
                  case -1 => // Category not found, should not happen
                  case indexToDelete => categories.remove(indexToDelete)
                }
              }
            }
            updatedProduct.category.foreach { newCategory =>
              if (!categories.exists(_.name == newCategory)) {
                categories += Category(categories.size + 1, newCategory.toString)
              }
            }
            products.update(index, updatedProduct.copy(id = Some(id)))
            Ok(Json.toJson(updatedProduct))
        }
      }
    )
  }

  def deleteProduct(id: Long): Action[AnyContent] = Action {
    products.indexWhere(_.id.contains(id)) match {
      case -1 => NotFound(Json.obj("error" -> "Product not found"))
      case index =>
        products.remove(index)
        NoContent
    }
  }

  def getProductsByCategory(category: String): Action[AnyContent] = Action {
    val filteredProducts = products.filter(_.category == category)
    Ok(Json.toJson(filteredProducts))
  }

  def addCategory(category: String): Action[AnyContent] = Action {
    if (!categories.exists(_.name == category)) {
      categories += Category(categories.size + 1, category)
      Created(Json.obj("message" -> "Category added successfully"))
    } else {
      Conflict(Json.obj("error" -> "Category already exists"))
    }
  }


  def listCategories: Action[AnyContent] = Action {
    val categoryNames = categories.map(_.name)
    Ok(Json.toJson(categoryNames))
  }


  def addToCart: Action[JsValue] = Action(parse.json) { request =>
  (request.body \ "productId").asOpt[Long].flatMap { productId =>
    (request.body \ "quantity").asOpt[Int].map { quantity =>
      if (!products.exists(_.id.contains(productId))) {
        NotFound(Json.obj("error" -> "Product not found"))
      } else {
        cart(productId) += quantity
        Ok(Json.obj("message" -> s"${quantity} units of product with ID ${productId} added to cart"))
      }
    }
  }.getOrElse {
    BadRequest(Json.obj("error" -> "Invalid JSON format"))
  }
}

def removeFromCart: Action[JsValue] = Action(parse.json) { request =>
  (request.body \ "productId").asOpt[Long].flatMap { productId =>
    (request.body \ "quantity").asOpt[Int].map { quantity =>
      if (!products.exists(_.id.contains(productId))) {
        NotFound(Json.obj("error" -> "Product not found"))
      } else {
        if (cart(productId) <= quantity) {
          cart -= productId
        } else {
          cart(productId) -= quantity
        }
        Ok(Json.obj("message" -> s"${quantity} units of product with ID ${productId} removed from cart"))
      }
    }
  }.getOrElse {
    BadRequest(Json.obj("error" -> "Invalid JSON format"))
  }
}

def viewCart: Action[AnyContent] = Action {
  val cartContents = for {
    (productId, quantity) <- cart
    product <- products.find(_.id.contains(productId))
  } yield (product, quantity)
  Ok(Json.toJson(cartContents))
}




}
