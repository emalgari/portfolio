import TypeWriterEffect from 'react-typewriter-effect';

function TypeWriter() {
    return (
        <TypeWriterEffect
            textStyle={{
                fontFamily: 'Red Hat Display',
                color: '#FFFF',
                fontWeight: 400,
                fontSize: '1.2em',
            }}
            startDelay={2000}
            cursorColor="#FFFF"
            multiText={[
                'HTML5',
                'CSS3',
                'JavaScript',
                'SASS',
                'Python',
                'React',
                'BootStrap',
                'Visual Studios Code',
                'Git and GitHub',
                'Figma',
                'Programming Techniques',
                'Agile Methodology',
                'Linux OS',
                'Windows OS',
                'Desktop Computer Hardware'
            ]}
            multiTextDelay={1100}
            typeSpeed={50} 
        />
    );
}

export default TypeWriter;



    

