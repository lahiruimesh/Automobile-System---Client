import React from 'react';
// 1. Image Import (Ensure the path is correct for your file: '../../assets/carImage2.png')
import CarImage from '../../assets/carImage2.png'; 

const HeroSection = () => {
    // Assign the imported path
    const CAR_IMAGE_URL = CarImage; 

    // URL where the user will be taken when clicking the AI Monitor title
    const HEADLINE_LINK_URL = '/ai-monitor-details'; 

    return (
        // !!! --- Top padding removed from section to allow it to fill the top --- !!!
        <section className="relative w-full min-h-screen bg-white pt-10 overflow-hidden">
            
            {/* Background/Gradient Effect: Silver-White-Silver at 45 degrees */}
            <div 
                className="absolute inset-0"
                // Custom inline style for the 45-degree silver-white-silver gradient
                style={{ backgroundImage: 'linear-gradient(-45deg, #d7d7d7 0%, #ffffff 50%, #d7d7d7 100%)' }}
            ></div>

            {/* Main Content Container */}
            {/* !!! --- TOP PADDING INCREASED to pt-20 to clear the fixed navbar --- !!! */}
            <div className="container px-4 sm:px-6 lg:px-6 relative z-10 pt-20">

                <div className="flex flex-col md:flex-row items-center justify-between">
                    
                    {/* Left Side: Car Visualization (Image aligned to the left of its column) */}
                    {/* !!! --- LEFT MARGIN DECREASED: justify-start now used on md screens --- !!! */}
                    <div className="relative w-full md:w-1/2 flex justify-center md:justify-start order-2 md:order-1 pt-10 md:pt-0">
                        
                        {/* Car visualization container (pulled slightly left using negative margin) */}
                        <div className="relative w-full max-w-4xl aspect-[1.2/1] scale-100 md:-mr-16"> 

                            {/* Outer Container for ROTATION */}
                            <div 
                                className="relative z-10 w-full h-full"
                                style={{ transform: 'rotate(-60deg)' }} // Base container rotation
                            >
                                
                                <div className="relative w-full h-full">

                                    {/* Blue Glow/AI Monitor focus area (Kept for visual effect) */}
                                    <div className="absolute top-[10%] left-[25%] w-1/2 h-1/2 bg-blue-500/50 
                                                  rounded-full blur-3xl opacity-70"></div>
                                                      
                                    
                                    {/* IMAGE INSERTED HERE WITH 90deg ROTATION */}
                                    <img 
                                        src={CAR_IMAGE_URL} 
                                        alt="AI Monitor Car Visualization" 
                                        className="absolute inset-0 w-full h-full object-contain p-4 z-20"
                                        style={{ transform: 'rotate(90deg)' }} // Applies the requested image rotation
                                    />
                                </div>
                            </div>
                            
                            {/* Data Point 1: 74% Less Wasted (Top Left) */}
                            <div className="absolute top-[0%] left-[0%] z-30"> 
                                <div className="bg-white p-2 rounded-xl backdrop-blur-sm text-xs shadow-md border border-gray-100 text-gray-800 flex items-center space-x-2">
                                    <span className="text-blue-600 font-bold block leading-none">74%</span>
                                    <span className="text-gray-600 block leading-none">Less wasted</span>
                                </div>
                            </div>

                            {/* Data Point 2: Autopilot Tuned (Bottom Right) */}
                            <div className="absolute bottom-[5%] right-[0%] z-30">
                                <div className="bg-white p-2 rounded-xl backdrop-blur-sm text-xs shadow-md border border-gray-100 text-gray-800 flex items-center space-x-2">
                                    <span className="text-gray-600 block leading-none">Autopilot</span>
                                    <span className="text-gray-600 block leading-none">tuned</span>
                                </div>
                            </div>

                            {/* Small Circular Data Points */}
                            <div className="absolute top-[25%] right-[10%] z-30 w-4 h-4 bg-white rounded-full border border-gray-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                            </div>
                            <div className="absolute top-[55%] right-[5%] z-30 w-4 h-4 bg-white rounded-full border border-gray-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Headline and CTAs (Reduced left padding for closer placement) */}
                    <div className="w-full ml-8 md:w-1/2 text-gray-900 order-1 md:order-2 md:pl-8 mt-10 md:mt-0">
                        
                        <a href={HEADLINE_LINK_URL} className="hover:text-blue-600 transition duration-150 block">
                            <h1 className="text-5xl lg:text-7xl font-light tracking-tight mb-6 leading-none">
                                <span className="font-medium">LIVE PROGRESS</span>
                            </h1>
                            <h2 className="text-5xl lg:text-5xl font-light tracking-tight mb-6 leading-none">
                                FOR YOUR SERVICE.
                            </h2>
                        </a>
                        
                        <p className="text-gray-600 max-w-md mb-8 text-lg">
                            Tech-X is a leader in analyzing electric vehicles using high-precision algorithms and an extensive database.
                        </p>

                        <div className="flex items-center space-x-6">
                            <button className="bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-700 transition duration-200 shadow-lg">
                                <a href="/Signup" className="hover:text-white transition duration-150">
                                Get Started
                                </a>    
                            </button>
                            <div className="flex items-center text-gray-500 text-sm">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mr-2">
                                    <span className="text-xs">Z</span>
                                </div>
                                Secured by ZEERR
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;