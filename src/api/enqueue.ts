import {HasId, SessionRestEndpoint} from "@lightningkite/lightning-server-simplified";

const preparing: Record<string, QueuedBulkFetch<any> | undefined> = {}
const alreadyGetting: Record<string, Record<string, Promise<any> | undefined>> = {}

class QueuedBulkFetch<T extends HasId> {
  toGet: Array<string> = []
  toGetCallbacks: Record<string, (t: T | undefined)=>void> = {}
  constructor(readonly key: string, readonly endpoint: SessionRestEndpoint<T>) {
    window.setTimeout(()=>{
      preparing[key] = undefined
      endpoint.query({
        condition: {
          _id: {
            Inside: this.toGet
          }
        },
        limit: 1000
      }).then(result => {
        for(const id in this.toGetCallbacks) {
          this.toGetCallbacks[id](result.find(x => x._id === id))
        }
      })
    }, 100)
  }
}

export function enqueueDetail<T extends HasId>(key: string, rest: SessionRestEndpoint<T>, id: string): Promise<T> {
  const typeSet = alreadyGetting[key] ?? (alreadyGetting[key] = {})
  const getting = typeSet[id]
  if(getting) return getting
  const queuedFetch = preparing[key] ?? (preparing[key] = new QueuedBulkFetch<any>(key, rest))
  const promise = new Promise<T>((resolve, reject)=>{
    queuedFetch.toGetCallbacks[id] = item => {
      typeSet[id] = undefined
      if(item) resolve(item)
      else reject("Item could not be found")
    }
    queuedFetch.toGet.push(id)
  })
  typeSet[id] = promise
  return promise
}