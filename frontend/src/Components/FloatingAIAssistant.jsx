import { Link } from "react-router-dom"

const FloatingAIAssistant = () => {

    return (
        <Link
            to="/ai-assistant"
            className="position-fixed d-flex align-items-center text-decoration-none shadow"
            style={{
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1050,
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                overflow: "hidden",
                transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.width = "210px"
                e.currentTarget.style.borderRadius = "30px"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.width = "55px"
                e.currentTarget.style.borderRadius = "50%"
            }}
        >

            <span
                style={{
                    minWidth: "55px",
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "25px"
                }}
            >
                🤖
            </span>

            <span
                style={{
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    fontSize: "14px",
                    paddingRight: "15px"
                }}
            >
                ShopMart AI Assistant
            </span>

        </Link>
    )
}

export default FloatingAIAssistant