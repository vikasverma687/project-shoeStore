


const Authfetch = async (url, options = {}) => {
  console.log("token:", localStorage.getItem("token")); 
    const token = localStorage.getItem("token");

    const isformdata = options.body instanceof FormData;

    const defaultHeader = {
        "Authorization": `Bearer ${token}`,
        ...(isformdata?{} : {"Content-Type": "application/json"})

    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeader,
            ...options.headers
        }
    });

    const newtoken = response.headers.get("NEW-ACCESS-TOKEN");

    if (newtoken) {

        localStorage.setItem("token", newtoken);


        const retryresponse = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${newtoken}`,
                ...options.headers
            }

        });
        return retryresponse;
    }
    return response;
}

export default Authfetch;