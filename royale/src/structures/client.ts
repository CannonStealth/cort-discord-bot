interface a {
    like: string
}

class Client implements a {
    constructor({}) {
        this.like = "a"
    }
}

export default Client