100 41.4667 2.0833
MongoServerError: invalid argument in geo near query: type
    at Connection.onMessage(C: \Users\licop\Desktop\handyman - service\node_modules\mongodb\lib\cmap\connection.js: 231: 30)
    at MessageStream.< anonymous > (C: \Users\licop\Desktop\handyman - service\node_modules\mongodb\lib\cmap\connection.js: 61: 60)
    at MessageStream.emit(node: events: 514: 28)
    at processIncomingData(C: \Users\licop\Desktop\handyman - service\node_modules\mongodb\lib\cmap\message_stream.js: 125: 16)
    at MessageStream._write(C: \Users\licop\Desktop\handyman - service\node_modules\mongodb\lib\cmap\message_stream.js: 33: 9)
    at writeOrBuffer(node: internal / streams / writable: 399: 12)
    at _write(node: internal / streams / writable: 340: 10)
    at Writable.write(node: internal / streams / writable: 344: 10)
    at TLSSocket.ondata(node: internal / streams / readable: 785: 22)
    at TLSSocket.emit(node: events: 514: 28)
    at addChunk(node: internal / streams / readable: 343: 12)
    at readableAddChunk(node: internal / streams / readable: 316: 9)
    at Readable.push(node: internal / streams / readable: 253: 10)
    at TLSWrap.onStreamRead(node: internal / stream_base_commons: 190: 23) {
    ok: 0,
        code: 2,
            codeName: 'BadValue',
                '$clusterTime': {
        clusterTime: new Timestamp({ t: 1720364920, i: 12 }),
            signature: {
            hash: new Binary(Buffer.from("1d8123e98f190dea414986ec75c52b4c6c4ab828", "hex"), 0),
                keyId: new Long("7329926899730219012")
        }
    },
    operationTime: new Timestamp({ t: 1720364920, i: 12 }),
        [Symbol(errorLabels)]: Set(0) { }
}