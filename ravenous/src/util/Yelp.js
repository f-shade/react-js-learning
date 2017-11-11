const clientId = 'CLIENT_ID_GOES_HERE';
const clientSecret = 'CLIENT_SECRET_GOES_HERE';
const grantType = 'client_credentials';
const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
let accessToken;

const Yelp = {
  async getAccessToken() {
    if(accessToken) {
      return new Promise(resolve => {resolve(accessToken)});
    }
    const authUrl = `https://api.yelp.com/oauth2/token?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}`;
    const requestUrl = corsAnywhereUrl + authUrl;
    console.log('Auth URL: ' + requestUrl);
    let response = await fetch(requestUrl,
    {method: 'POST',
     headers: {"Content-type": "application/x-www-form-urlencoded"},
    });

    if (response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      accessToken = jsonResponse.access_token;
    }
  },

  async search(term, location, sortBy) {
    return new Promise(async (resolve, reject) => {
      await this.getAccessToken();

      const searchUrl = `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
      const requestUrl = corsAnywhereUrl + searchUrl;
      let response = await fetch(requestUrl,
                      {method: 'GET',
                        headers: {"Authorization": `Bearer ${accessToken}`}});

      if (response.ok) {
        let jsonResponse = await response.json();
        console.log(jsonResponse);

        // Valid response should contain a business
        if (jsonResponse.businesses) {
          resolve(jsonResponse.businesses.map(business => {
            return {
              id: business.id,
              imageSrc: business.image_url,
              name: business.name,
              address: business.location.address1,
              city: business.location.city,
              state: business.location.state,
              zipCode: business.location.zip_code,
              category: business.categories.title,
              rating: business.rating,
              reviewCount: business.review_count
            }
          }));
        }
        else {
          reject('Request failed, no businesses key!');
        }
      }
    });
  }
};

export default Yelp;
