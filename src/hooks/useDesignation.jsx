const useDesignation = () => {
    const serviceLines = [
        {
            name:'Digital & Innovation',
            availablePositions: [
                'Analyst Programmer',
                'Sr. Analyst Programmer'
            ]
        },
        {
            name:'Application Development & Support',
            availablePositions: [
                'Analyst Programmer',
                'Sr. Analyst Programmer'
            ]
        },
        {
            name:'Finance Shared Services',
            availablePositions: [
                'Accounts Payable',
                'Accounts Receivable'
            ]
        },
        {
            name:'Master Data Management',
            availablePositions: [
                'Analyst',
                'Sr. Analyst'
            ]
        },
    ]

    const getServiceLines = () => {
        return serviceLines;
    }

    return [getServiceLines];
}

export default useDesignation;