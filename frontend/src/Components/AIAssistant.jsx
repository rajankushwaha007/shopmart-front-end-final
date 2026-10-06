import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { createCart } from "../Redux/ActionCreators/CartActionCreators"


const AIAssistant = () => {

    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const CartStateData = useSelector(
        state => state.CartStateData
    )


    // Suggested Questions

    const suggestedQuestions = [
        {
            icon: "💻",
            title: "Laptops",
            question: "Show me laptops under ₹50,000"
        },
        {
            icon: "📱",
            title: "Smartphones",
            question: "Show me smartphones under ₹20,000"
        },
        {
            icon: "👕",
            title: "T-Shirts",
            question: "Show me T-shirts under ₹1,000"
        },
        {
            icon: "🎧",
            title: "Headphones",
            question: "Show me headphones under ₹3,000"
        },
        {
            icon: "🏷️",
            title: "HP Products",
            question: "Which products are available from HP?"
        },
        {
            icon: "🛍️",
            title: "ShopMart Products",
            question: "What products are available?"
        }
    ]


    // Add Product To Cart

    const addToCart = (product) => {

        const userId = localStorage.getItem("userid")

        if (!userId) {
            alert("Please login first to add products to cart.")
            return
        }

        const existingItem = CartStateData.find(
            item =>
                item.product?._id === product.id &&
                item.user?._id === userId
        )

        if (existingItem) {
            alert("Product is already in your cart.")
            return
        }

        const cartItem = {
            user: userId,
            product: product.id,
            quantity: 1,
            color: product.colors?.[0] || "",
            size: product.sizes?.[0] || "",
            total: product.price
        }

        dispatch(createCart(cartItem))

        alert("Product added to cart!")
    }


    // Ask AI

    const askAI = async (customQuestion = null) => {

        const userQuestion = customQuestion || question

        if (!userQuestion.trim()) return

        try {

            setLoading(true)
            setAnswer("")
            setProducts([])

            setQuestion(userQuestion)

            const response = await fetch(
                "https://shopmart-server-final-0dwi.onrender.com/api/ai/assistant",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: userQuestion
                    })
                }
            )

            const data = await response.json()

            if (data.success) {

                setAnswer(data.answer)
                setProducts(data.products || [])

            } else {

                setAnswer("Sorry, something went wrong.")

            }

        } catch (error) {

            console.log("AI Frontend Error:", error)

            setAnswer(
                "Unable to connect with AI Assistant."
            )

        } finally {

            setLoading(false)

        }
    }


    return (

        <div className="container my-5">


            {/* AI Header */}

            <div className="text-center mb-5">

                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white shadow"
                    style={{
                        width: "70px",
                        height: "70px",
                        fontSize: "30px"
                    }}
                >
                    🤖
                </div>

                <h2 className="fw-bold mt-3 mb-2">
                    ShopMart AI Assistant
                </h2>

                <p className="text-muted mb-0">
                    Find products, compare prices and discover products
                    using AI.
                </p>

            </div>


            {/* Search Box */}

            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Ask something like: Show me T-shirts under ₹1000"
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    askAI()
                                }

                            }}
                        />

                        <button
                            className="btn btn-primary px-4"
                            onClick={() => askAI()}
                            disabled={loading}
                        >
                            {loading
                                ? "Thinking..."
                                : "Ask AI"
                            }
                        </button>

                    </div>

                </div>

            </div>


            {/* Suggested Questions */}

            {!answer && !loading && (

                <div className="mt-4">

                    <div className="text-center mb-4">

                        <p className="fw-bold mb-1">
                            What are you looking for?
                        </p>

                        <small className="text-muted">
                            Try one of these AI-powered searches
                        </small>

                    </div>


                    <div className="row g-3">

                        {suggestedQuestions.map(
                            (item, index) => (

                                <div
                                    className="col-12 col-sm-6 col-lg-4"
                                    key={index}
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            askAI(item.question)
                                        }
                                        className="w-100 text-start border-0 bg-white"
                                        style={{
                                            borderRadius: "16px",
                                            padding: "18px",
                                            minHeight: "120px",
                                            boxShadow:
                                                "0 4px 15px rgba(0,0,0,0.08)",
                                            transition:
                                                "all 0.25s ease",
                                            cursor: "pointer"
                                        }}
                                        onMouseEnter={(e) => {

                                            e.currentTarget.style.transform =
                                                "translateY(-5px)"

                                            e.currentTarget.style.boxShadow =
                                                "0 10px 25px rgba(37,99,235,0.18)"

                                        }}
                                        onMouseLeave={(e) => {

                                            e.currentTarget.style.transform =
                                                "translateY(0)"

                                            e.currentTarget.style.boxShadow =
                                                "0 4px 15px rgba(0,0,0,0.08)"

                                        }}
                                    >

                                        <div className="d-flex align-items-start">


                                            {/* Icon */}

                                            <div
                                                className="d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    minWidth: "48px",
                                                    borderRadius: "12px",
                                                    background: "#eff6ff",
                                                    fontSize: "24px"
                                                }}
                                            >
                                                {item.icon}
                                            </div>


                                            {/* Text */}

                                            <div>

                                                <h6
                                                    className="fw-bold mb-1"
                                                    style={{
                                                        color: "#1f2937"
                                                    }}
                                                >
                                                    {item.title}
                                                </h6>

                                                <p
                                                    className="mb-0 small"
                                                    style={{
                                                        color: "#6b7280",
                                                        lineHeight: "1.5"
                                                    }}
                                                >
                                                    {item.question}
                                                </p>

                                            </div>

                                        </div>

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* Loading */}

            {loading && (

                <div className="text-center my-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    ></div>

                    <p className="mt-3 text-muted">
                        AI is finding the best products for you...
                    </p>

                </div>

            )}


            {/* AI Response */}

            {answer && !loading && (

                <div className="card border-0 shadow-sm mt-4">

                    <div className="card-body p-4">

                        <div className="d-flex align-items-start">

                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    minWidth: "42px"
                                }}
                            >
                                🤖
                            </div>

                            <div>

                                <h6 className="fw-bold mb-2">
                                    ShopMart AI
                                </h6>

                                <p className="mb-0">
                                    {answer}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* Products */}

            {products.length > 0 && !loading && (

                <div className="mt-5">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h4 className="fw-bold mb-0">
                            Recommended Products
                        </h4>

                        <span className="text-muted">
                            {products.length} products found
                        </span>

                    </div>


                    <div className="row g-4">

                        {products.map((product) => {

                            const imagePath =
                                product.pic?.[0]
                                    ?.replaceAll("\\", "/")


                            return (

                                <div
                                    className="col-12 col-sm-6 col-lg-4"
                                    key={product.id}
                                >

                                    <div className="card h-100 border-0 shadow-sm">


                                        {/* Product Image */}

                                        <div
                                            style={{
                                                height: "250px",
                                                overflow: "hidden",
                                                background: "#f8f9fa"
                                            }}
                                        >

                                            <img
                                                src={`${import.meta.env.VITE_APP_IMAGE_SERVER}${imagePath}`}
                                                className="w-100 h-100"
                                                alt={product.name}
                                                style={{
                                                    objectFit: "contain",
                                                    padding: "15px"
                                                }}
                                            />

                                        </div>


                                        {/* Product Details */}

                                        <div className="card-body">

                                            <h5 className="fw-semibold">
                                                {product.name}
                                            </h5>

                                            <p className="text-muted mb-2">

                                                {product.category}

                                                {product.subcategory
                                                    ? ` • ${product.subcategory}`
                                                    : ""
                                                }

                                            </p>


                                            <div className="d-flex align-items-center gap-2">

                                                <h5 className="fw-bold text-primary mb-0">
                                                    ₹{product.price}
                                                </h5>

                                                {product.basePrice >
                                                    product.price && (

                                                        <small
                                                            className="text-muted text-decoration-line-through"
                                                        >
                                                            ₹{product.basePrice}
                                                        </small>

                                                    )}

                                            </div>

                                        </div>


                                        {/* Buttons */}

                                        <div className="d-flex gap-2 p-3 pt-0">

                                            <Link
                                                to={`/product/${product.id}`}
                                                className="btn btn-outline-primary flex-grow-1"
                                            >
                                                View Product
                                            </Link>

                                            <button
                                                className="btn btn-primary flex-grow-1"
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                                disabled={!product.stock}
                                            >
                                                <i className="fas fa-shopping-cart me-2"></i>
                                                Add to Cart
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                </div>

            )}

        </div>

    )
}
export default AIAssistant