import "bootstrap/dist/css/bootstrap.css";
import BuildClient from "../api/build-client";
import Nav from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Nav currentUser={currentUser}/>
        <Component {...pageProps} />
    </div>
};

AppComponent.getInitialProps = async (appContext) => {
    const client = BuildClient(appContext.ctx);

    const { data } = await client.get("/api/users/currentuser");

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        ...data
    };
}

export default AppComponent;