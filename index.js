function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // window.location.href = "https://leoka-estetica-dev.ru/profile/aboutme?mode=view";
    // const responsePayload = decodeJwtResponse(response.credential);

    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);
  }
  window.onload = function () {
    google.accounts.id.initialize({
      client_id: "418999951875-s1smtv8oitn579i8pd4na059pnbctf19.apps.googleusercontent.com",
      callback: handleCredentialResponse
      // login_uri: API_URL.apiUrl + ""
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"), {
        theme: "outline",
        size: "large"
      }
    );
    google.accounts.id.prompt();
  }