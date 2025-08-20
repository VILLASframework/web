function nxhr_builder(elem,path,next){
    return ()=>{
        const e = document.getElementById(elem)
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200){
                if(next) next()
                if(e) e.innerHTML = xhr.responseText
                else console.log(`Expected to find element ${elem}`)
            }
        }
        xhr.open('GET',path)
        xhr.send()
    }
}

function inject(){
    const fhr = nxhr_builder('brand-footer','/branding/footer.html')
    const hhr = nxhr_builder('brand-home','/branding/home.html',fhr)
    const whr = nxhr_builder('brand-welcome','/branding/welcome.html',hhr)
    const header = document.getElementById('brand-header')
    const links = document.getElementById('brand-links')
    const menu_logo = document.getElementById('brand-menu-logo')
    let jhr = new XMLHttpRequest();
    jhr.onreadystatechange = function() {
        if (jhr.readyState == 4 && jhr.status == 200) {
            const values = JSON.parse(jhr.responseText)
            console.log(values)
            header.innerHTML = get_header(values)
            if(links) links.innerHTML = get_links(values)
            whr()
            if(menu_logo) menu_logo.src = `/branding/img/${values.logo}`
            apply_style(values);
        }
    }
    jhr.open('GET', '/branding/values.json');
    jhr.send();
}

// if icon cannot be found, the default favicon will be used
function change_head(values) {
    // set title of document
    let title = get_title(values);
    if (get_subtitle(values)) {
        title += " " + get_subtitle(values);
    }
    document.title = title;

    // set document icon
    if (!values.icon) {
        return;
    }
    var oldlink = document.getElementById("dynamic-favicon");

    var link = document.createElement("link");
    link.id = "dynamic-favicon";
    link.rel = "shortcut icon";
    link.href = "/branding/img/" + values.icon;

    if (oldlink) {
        document.head.removeChild(oldlink);
    }
    document.head.appendChild(link);
}

function apply_style(values) {
    change_head(values);

    const rootEl = document.querySelector(":root");

    for (const [key, value] of Object.entries(values.style)) {
        rootEl.style.setProperty("--" + key, value);
    }
}

function get_title(values) {
    return values.title ? values.title : "VILLASweb";
}

function get_subtitle(values) {
    return values.subtitle ? values.subtitle : "RT co-simulation";
}

function get_links(values){
    let links = [];

    if (values.links) {
        Object.keys(values.links).forEach(key => {
        links.push(`<li key=${key}><a href=${values.links[key]} title=${key}>${key}</a></li>`);
        })
    }

    return links.join('\n');
}

function get_header(values){
    return `
        <header class="app-header">
            <h1>${get_title(values)} - ${get_subtitle(values)}</h1>
        </header>
    `
}

inject()