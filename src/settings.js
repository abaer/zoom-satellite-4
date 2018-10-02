const listmappings = {
    'alan': 'gen_two',
    'jeff_dean': 'test_dir_d',
    'kaveh_akbar': 'test_dir_akbar_2',
    'ottolenghi': 'test_dir_ottolenghi',
    'om': 'test_dir_om_2',
    'mark_jardine': 'test_dir_jardine',
    'abrams': 'dir_abrams'
}

function keyByVal(json, val){
    for (var key in json) {
        if(json[key] === val){
            return key
        }
    }
    return undefined
}

export {
    listmappings,
    keyByVal
}