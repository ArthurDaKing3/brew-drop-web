

const ErrorAlert = ({ message }) => {
    console.error("Error:", message);
    return (
        <div className="alert alert-danger mx-3" role="alert" style={{ marginTop: "15vh" }}>
            {message}
        </div>
    );
}

export default ErrorAlert;