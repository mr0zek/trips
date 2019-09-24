$url = "https://photoslibrary.googleapis.com/v1/mediaItems:search?fields=mediaItems(baseUrl,mediaMetadata/creationTime,filename)"
$token = "Bearer ya29.GlyMB_GP7ggAhYDLzQ6UFde8lyQ5-C-p8OBqq3JG2dNaidGZgRqvGYZHwNPCuvsmUKCuSHvejyQaSMrkOEF9QPejqJVyKAnVz3UD44a-ZMytUNOaHdJEKEhp95PdNg"
$data = (ConvertFrom-Json (Invoke-WebRequest -Method Post -Uri $url -UseBasicParsing -Headers @{ "Authorization" =  $token;  }).Content).MediaItems 

$html = ""
foreach($d in $data)
{
  $html += "<a class=""glightbox2"" href=""$($d.baseUrl)""><img src=""$($d.baseUrl)=w102""/></a>`n"
}

$html
