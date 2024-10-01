import axios from "axios";

export const headerConfig = (token: string) => {
    return(
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            
        }
    )
}

export const axiosProductos = axios.create({
    baseURL: `${process.env.PRODUCTOS_LINK}/api`
})

export const axiosGetStatesFromCountry = axios.create({
    baseURL: `https://countriesnow.space/api/v0.1/countries/states`
})

export const axiosGetCitiesFromProvince = axios.create({
    baseURL: `https://countriesnow.space/api/v0.1/countries/state/cities`
})