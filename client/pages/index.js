import axios from "axios";

const Index = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Index</h1>
}

Index.getInitialProps = async ({ req }) => {
    if (typeof window === "undefined") {
        // we are on the server; base url 'http://ingress-srv.namespace.svc...'
        const {data} = await axios.get(
            "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser", {
                headers: req.headers
        });

        return { currentUser: data };
    } else {
        // we are on the browser; base url ''
        const { data } = await axios.get("/api/users/currentuser");
        return { currentUser: data };
    }

};

export default Index;