// This file defines a centralized config object for multiple environments (dev, qa, prod)
// Below 'environments' object stores dev, qa and prod type objects (Environments)
// dev, qa and prod each objects stores string properties (Application wise API base URLs)
export const environments = {
    dev: {
        bookingAPI: "https://restful-booker.herokuapp.com",
        authAPI: "https://restful-booker.herokuapp.com",
    },
    qa: {
        bookingAPI: "https://restful-booker.herokuapp.com",
        authAPI: "https://restful-booker.herokuapp.com",
    },
    prod: {
        bookingAPI: "https://restful-booker.herokuapp.com",
        authAPI: "https://restful-booker.herokuapp.com",
    },
};
