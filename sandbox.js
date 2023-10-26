obj = {
  tag0: 'History',
  tag1: 'Indonesia'
}

for (key in obj) {
  if (key.includes(tag)) {

    await Tag.findAll({
      name: obj[key]
    })
  }
}