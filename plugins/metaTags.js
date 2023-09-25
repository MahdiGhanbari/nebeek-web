
export default function getMetaTags (route, entity, local) {  
    let path ='http://nebeek.com/' + route.fullPath;
    let result = {
        titleTemplate: '%s - Nebeek',
        meta: [
            {name: "twitter:card", content: "summary"},
            {property: "og:url", content: path },
            {property: "og:site_name", content: "Nebeek" },
            {name: "twitter:site", content: "Nebeek"}
        ],
        script : [],
        __dangerouslyDisableSanitizers: ['script']
    }

    for(let field in entity) {
        switch(field) {
            case 'type':
                let type = entity.type;
                type = route.name == 'list-id' ? "collection" : type;
                result.meta.push( 
                    {property: "og:type", content: type}
                );
            break;
            case 'name':
                let name = entity.name[local];
                name = name != '' ? name : entity.name['fa'];
                name = route.name == 'list-id' ?  (local == 'en' ? name + ' list' : 'لیست '+ name) : name;
                result['title'] = name;
                result.meta.push( 
                    {property: "og:title", content: name},
                    {itemprop: "name", content: name},
                    {name: "twitter:title", content: name}
                );
            break;
        }
    }
    return result;
}