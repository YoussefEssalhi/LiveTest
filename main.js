// HTML-Elements
const user_element = document.getElementById("ip");
const score_element = document.getElementById("score_text");
const copy_button = document.querySelector(".copy_btn");
const ip_type = document.getElementById("ip_type");
const vpn_status = document.getElementById("vpn_status");
const proxy_status = document.getElementById("proxy_status");
const tor_status = document.getElementById("tor_status");
const blacklist_status = document.getElementById("blacklist_status");
const websites_behavior = document.getElementById("websites_behavior");
const social_media_status = document.getElementById("social_media_status");

// Variables
let user_ip_address = '';
const RedColor = "#ff4d4d";
const LightRedColor = "#ff9999";
const GreenColor =  "#20bf6b";
const LightGreenColor = "#C6E8C5";
const YellowColor = "#fff200";
const LightYellowColor = "#f7f7a51c";

// Timeout Promise
const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), 60000)
);

// Function to Copy IP
function CopyIP()
{
    navigator.clipboard.writeText(user_ip_address);
    copy_button.innerHTML = '<i class="fa-regular fa-clone"></i>';
    setTimeout(function()
    {
        copy_button.innerHTML = '<i class="fa-solid fa-clone"></i>';
    }, 150);
};

async function UserIp()
{
    try
    {
        let response = await fetch("https://api.ipify.org/?format=json");
        let data = await response.json();
        user_ip_address = data.ip;
        user_element.innerHTML = `Your IP Address : ${user_ip_address}`;
    }
    catch (error)
    {
        console.error("Error fetching IP address:", error);
        user_element.innerHTML = "Unable to Retrieve IP-Address.";
    };
};

function UpdateDetectionElement(WebElement, CheckStatus, CheckType, MoreInfo)
{
    if (CheckStatus === false)
    {
        WebElement.innerHTML = '<i class="fa-solid fa-square-check"></i>'
        if (CheckType === "Blacklist")
        {
            WebElement.innerHTML += " Your IP Address is not on any Blacklist";
        }
        else
        {
            WebElement.innerHTML += ` You don't use ${CheckType}`;
        };
        WebElement.style.color = GreenColor;
    }
    else
    {
        WebElement.innerHTML = `<i class="fa-solid fa-rectangle-xmark"></i>`;
        if (CheckType === "Blacklist")
        {
            WebElement.innerHTML += ` Your IP in ${CheckType}`;
        }
        else
        {
            WebElement.innerHTML += ` You use ${CheckType}`;
            if (MoreInfo !== '')
            {
                WebElement.innerHTML += ` ( ${MoreInfo} ) `;
            };
        };
        WebElement.style.color = RedColor;
    };
};

function UpdateWebSiteBehavior(WebElement, CheckStatus)
{
    if (CheckStatus === "allow")
    {
        WebElement.innerHTML = `<p> status : ${CheckStatus}</p> <i class="fa-solid fa-circle-check"></i>`;
        WebElement.style.color = GreenColor;
        WebElement.style.backgroundColor = LightGreenColor;
    }
    else if ( CheckStatus == "review")
    {
        WebElement.innerHTML = `<p> status : ${CheckStatus}</p> <i class="fa-solid fa-circle-exclamation"></i>`;
        WebElement.style.color = YellowColor;
        WebElement.style.backgroundColor = LightYellowColor;
    }
    else
    {
        WebElement.innerHTML = `<p> status : ${CheckStatus}</p> <i class="fa-solid fa-circle-xmark"></i>`;
        WebElement.style.color = RedColor;
        WebElement.style.backgroundColor = LightRedColor;
    };
};

async function CheckIpDetection()
{
    try
    {
        // Send IP to API ( API Dyali hhh Rah maghdich n7ato open source )
        let api = `https://testlive-39ca.onrender.com/${user_ip_address}`;
        let fetchPromise = await fetch(api);
        let response = await Promise.race([fetchPromise, timeoutPromise]);
        let data = await response.json();

        // IP Score
        score_element.setAttribute("per", `${data.score}%`);
        score_element.style.maxWidth = data.score + '%';

        // IP-Type
        ip_type.innerHTML = `( IP Type : ${data.connection_type} )`;

        // Detection Status
        UpdateDetectionElement(vpn_status, data.vpn, "VPN", data.vpn_type);
        UpdateDetectionElement(proxy_status, data.proxy, "Proxy", data.proxy_type);
        UpdateDetectionElement(tor_status, data.tor, "Tor", '');
        UpdateDetectionElement(blacklist_status, data.blacklist, "Blacklist", '');

        // WebSites Behavior
        UpdateWebSiteBehavior(websites_behavior, data.behavior);
        UpdateWebSiteBehavior(social_media_status, data.social_media_behavior);

    }
    catch (error)
    {
        console.error('Error:', error);
    };
};

// Start Proccess
async function VisitPage()
{
    await UserIp();
    if (user_ip_address !== '')
    {
        await CheckIpDetection();
    };
};

window.onload = () => { VisitPage(); };

// window.onload = VisitPage;
// Nzid Dark/Light Mode
