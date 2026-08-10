const DOMAIN = "http://localhost:3000"

export const addUser = async function(payload){
    const response = await fetch(`${DOMAIN}/api/signup`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
    })
    return response.json()
}

export const getChats = async function(_id){
    const response = await fetch(`${DOMAIN}/api/chats/getChats/${_id}`)
    return response.json()
}

export const addChats = async function(payload){
    const response = await fetch(`${DOMAIN}/api/chats/addchat`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    return response.json()
}

export const getMessage = async function(chatId){
     const response = await fetch(`${DOMAIN}/api/message/getmessofchat/${chatId}`)
    return response.json()
}

export const sendMessage = async function (payload){
    const response = await fetch(`${DOMAIN}/api/message/addmess`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    return response.json()
}

export const getGroups = async function(_id){
    const response = await fetch(`${DOMAIN}/api/group/getgroups/${_id}`)
    return response.json()
}

export const getoneGroup = async function(_id){
    const response = await fetch(`${DOMAIN}/api/group/getonegroup/${_id}`)
    return response.json()
}

export const deleteMess = async function(_id){
    const response = await fetch(`${DOMAIN}/api/message/deleteMessage/${_id}`, {
        method: 'DELETE',
    })
    return response.json()
}