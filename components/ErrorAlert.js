

const ErrorAlert = ({ message }) => {
    return (
        <div className="alert alert-danger" role="alert" style={{ marginTop: "15vh" }}>
            {message}
        </div>
    );
}

export default ErrorAlert;