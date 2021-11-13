import { withAuthenticator } from '@aws-amplify/ui-react'
import { useState } from 'react'
import { API, Storage } from 'aws-amplify'
import { createPark } from '../src/graphql/mutations'
import config from '../src/aws-exports'

function CreatePark() {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        const uploadedImage = await Storage.put(image.name, image)

        const newPark = await API.graphql({
            query: createPark,
            variables: {
                input: {
                    name,
                    image: {
                        region: config.aws_user_files_s3_bucket_region,
                        bucket: config.aws_user_files_s3_bucket,
                        key: uploadedImage.key
                    }
                }
            }
        })

        console.log(newPark)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create a Park</h2>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter Name" onChange={e => setName(e.target.value)} />
            <label htmlFor="image">Image</label>
            <input type="file" name="image" id="image" placeholder="Enter Image" onChange={e => setImage(e.target.files[0])} />
            <input type="submit" value="Create" />
        </form>
    )
}

export default withAuthenticator(CreatePark)