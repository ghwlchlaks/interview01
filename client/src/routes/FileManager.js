import React, { Component } from 'react'

const fileManager = ({match}) => {
    return (
        <div>
            {match.params.username} 의 파일매니저
        </div>
    )
}

export default fileManager;