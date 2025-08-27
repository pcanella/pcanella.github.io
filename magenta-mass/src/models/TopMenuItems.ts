const topMenuItems = {
    linkedIn: [
        { title: "My Profile", href: "https://www.linkedin.com/in/patrickcanella" }
    ],
    github: [
        { title: 'My Profile', href: "https://github.com/pcanella/" },
        { title: "Repos", href: "https://github.com/pcanella?tab=repositories" }
    ],
    instagram: [
        { title: '@pcanella', href: 'https://instagram.com/pcanella' },
        { title: '@klickytracker', href: 'https://instagram.com/klickytracker' }
    ],
    about: [
        { title: 'Resume', href: 'https://www.patcanella.com/resume' },
        { title: 'Dev.to Blog', href: 'https://dev.to/pcanella' },
    ],
    pc: [
        { title: 'Life Details', onClick: () => {alert('hi')} },
    ]
}

export default topMenuItems;