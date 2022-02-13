import { useStore } from "../stores/store";

const ServerError = () => {
    const { commonStore } = useStore();

    return (
        <>
            <h1>Pogreška na serveru</h1>
            <h5>{commonStore.error?.message}</h5>
            {commonStore.error?.details && (
                <div>
                    <h4>Stack trace:</h4>
                    <code style={{ marginTop: "10px" }}>{commonStore.error.details}</code>
                </div>
            )}
        </>
    );
};

export default ServerError;