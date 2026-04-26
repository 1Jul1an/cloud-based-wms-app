import React from 'react'
import Link from 'next/link'

interface FeatureCardProps {
    title: string
    description: string
    href: string
    icon: React.ReactNode
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, href, icon }) => {
    return (
        <Link href={href} className="group rounded-[1.75rem] border border-slate-200/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.12)]">
            <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-blue-600">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </Link>
    )
}

export default FeatureCard
