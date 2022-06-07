/**
 * Example template tag that generates a random number 
 * between a user-provided MIN and MAX
 */
module.exports.templateTags = [{
    name: 'headerSubstring',
    displayName: 'Header Substring',
    description: 'Get substring from response header',
    args: [
        {
            displayName: 'Request',
            type: 'model',
            model: 'Request',
        },
        {
            displayName: 'Header name',
            type: 'string',
        },
        {
            displayName: 'Return content after...',
            type: 'string',
        },
        {
            displayName: '...and before',
            type: 'string',
        },
    ],
    async run (context, id, headerName, contentAfter, contentBefore) {
        const environmentId = context.context.getEnvironmentId();
        let response = await context.util.models.response.getLatestForRequestId(id, environmentId);
        let value = ''
        try{
            value = response.headers.filter(header=>header.name == headerName)[0].value
            if(contentAfter){
                value = value.split(contentAfter)[1];
            }
            if(contentBefore){
                value = value.split(contentBefore)[0];
            }
        }catch(e){
            const headerNames = response.headers.map(header=>` - ${header.name}`).join('\n');
            throw new Error(`Invalid header ${headerName}. Possible values are: \n${headerNames}`)
        }
        return value;
    }
}];
