const listmappings = {
    'Alan': 'gen_two',
    'Jeff_Dean': 'test_dir_d',
    'Kaveh_Akbar': 'test_dir_akbar_2',
    'Ottolenghi': 'test_dir_ottolenghi',
    'OM': 'test_dir_om_2',
    'Mark_Jardine': 'test_dir_jardine',
    'Abrams': 'dir_abrams'
}

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

const listmappings_by_dir = swap(listmappings)


export {
    listmappings,
    listmappings_by_dir
}