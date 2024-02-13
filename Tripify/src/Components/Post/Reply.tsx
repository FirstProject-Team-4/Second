
export default function Reply(prop:{reply:{content:string}}) {

    return (
        <div style={{border:'1px solid red'}}>
            <h1>{prop.reply.content}</h1>
   
        </div>
    )
}
