

const ErrorAlert = ({ message, details }) => {
    console.error("Error:", details);
    return (
        <div className="alert alert-danger mx-3" role="alert" style={{ marginTop: "15vh" }}>
            {message}. Open Console for more details.
        </div>
    );
}

export default ErrorAlert;