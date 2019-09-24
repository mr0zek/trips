
# $url = "https://accounts.google.com/o/oauth2/auth?client_id=193597893552-vn5qd1ah98j7lmedusk76c3il10rteta.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/photoslibrary.readonly&response_type=code&redirect_uri=https://localhost/&access_type=offline&approval_prompt=force"




$requestUri = "https://www.googleapis.com/oauth2/v4/token"
$body = @{
  code          = "4/rgEmCStGXwlRjJrANaEVVzZWF9cvpcN3SwAY-ukFnpcMY_G72FJWYyYBPaxi94cHPaimIjX_GnHL6hvHUnjnKVU";
  client_id     = "193597893552-vn5qd1ah98j7lmedusk76c3il10rteta.apps.googleusercontent.com";
  client_secret = "rid-4ikWVXEzlDWSy536mZiq";
  redirect_uri  = "https://localhost/";
  grant_type    = "authorization_code"; # Fixed value
};

$tokens = Invoke-RestMethod -Uri $requestUri -Method POST -Body $body -UseBasicParsing -UseDefaultCredentials;

# Store refreshToken
Set-Content $PSScriptRoot"\refreshToken.txt" $tokens.refresh_token
# Store accessToken
Set-Content $PSScriptRoot"\accessToken.txt" $tokens.access_token

$url = "https://photoslibrary.googleapis.com/v1/mediaItems:search"
$token = "Bearer $($tokens.access_token)"
$data = (ConvertFrom-Json (Invoke-WebRequest -Method Post -Uri $url -UseBasicParsing -Headers @{ "Authorization" =  $token;  }).Content).MediaItems 

$html = ""
foreach($d in $data)
{
  $html += "<figure itemprop=""associatedMedia"" itemscope itemtype=""http://schema.org/ImageObject"">"
  $html += "<a href=""$($d.baseUrl)"" itemprop=""contentUrl"" data-size=""$($d.mediaMetadata.width)x$($d.mediaMetadata.height)"">"
  $html += "<img src=""$($d.baseUrl)=w$([math]::Round($d.mediaMetadata.width/10))-h$([math]::Round($d.mediaMetadata.height/10))"" itemprop=""thumbnail"" alt=""$($d.filename)"" />"
  $html += "</a>"
  $html += "<figcaption itemprop=""caption description"">$($d.filename)</figcaption>"
  $html += "</figure>"
}

Set-Content c:\My\trips\out.txt $html
