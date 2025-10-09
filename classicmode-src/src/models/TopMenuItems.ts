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
        { title: 'About this Site...', id: 'aboutThisSite', onClick: () => {alert('hi')} },
        // { title: 'Life Details', id: 'lifeDetails', onClick: () => {alert('hi')} },
    ],
    special: [
         { title: 'Back to Modern Site', href: 'https://www.patcanella.com' },
    ]
}

export default topMenuItems;