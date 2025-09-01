import React from 'react';
import suggerAvatar from '../assets/sugger_av.png';

const team = [
  {
    name: 'Sugger',
    role: 'UI & Scripting Engineer',
    bio: 'Specializes in Bedrock JSON UI systems, custom panels, pack settings, and high-performance script modules.',
    skills: ['JSON UI',  'Scripting API', 'Layouting'],
  avatar: suggerAvatar
  },
  {
    name: 'Kuma',
    role: 'Texture & 3D Modeller',
    bio: 'Creates optimized textures, PBR-ready assets, and low-poly rigs for smooth performance in Bedrock worlds.',
    skills: ['Texturing', 'Modeling', 'Blockbench', 'Glyphs'],
    avatar: 'https://cdn.discordapp.com/avatars/1250431868478685337/55dcb4e9a145bf80ee3a3ec79d22f1c5?size=1024'
  }
];

const About = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2>About Us</h2>
        <div className="team-grid">
          {team.map((member, idx) => (
            <div className="card reveal" style={{ '--d': `${idx * 0.08}s` }} key={member.name}>
              <img className="avatar" src={member.avatar} alt={member.name} />
              <div className="card-body">
                <h3>{member.name}</h3>
                <p className="muted">{member.role}</p>
                <p>{member.bio}</p>
                <div className="chips">
                  {member.skills.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
