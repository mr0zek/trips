
# $url = "https://accounts.google.com/o/oauth2/auth?client_id=193597893552-vn5qd1ah98j7lmedusk76c3il10rteta.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/photoslibrary.readonly&response_type=code&redirect_uri=https://localhost/&access_type=offline&approval_prompt=force"




$requestUri = "https://www.googleapis.com/oauth2/v4/token"
$body = @{
  code="4/rQFalhZXzvxNd-QXXAiv4mQgJLSheoGSSydl7zQaz7Yo-wZOIFxpspWbTApk23eiRhWh7Q05KWDYCNWwZ3NKgaM";
  client_id="193597893552-vn5qd1ah98j7lmedusk76c3il10rteta.apps.googleusercontent.com";
  client_secret="rid-4ikWVXEzlDWSy536mZiq";
  redirect_uri="https://localhost/";
  grant_type="authorization_code"; # Fixed value
};
$tokens = Invoke-RestMethod -Uri $requestUri -Method POST -Body $body -UseBasicParsing -UseDefaultCredentials;
# Store refreshToken
Set-Content $PSScriptRoot"\refreshToken.txt" $tokens.refresh_token
# Store accessToken
Set-Content $PSScriptRoot"\accessToken.txt" $tokens.access_token
