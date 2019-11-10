import React from 'react';
import Modal from 'react-modal';
import {Button, Icon} from 'antd';

const customStyles = {
  content : {
    height                : '500px',
    width                 : '500px',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const data = [
  'Data is queried evey 10 seconds. Click refresh.',
  'The spread is the difference between the lowest available ask and the highest available bid among different exchange prices.',
  'Coins with less than 1 BTC in volume have been ignored and marked as Low Volume.',
  'The bot currently queries 10 highly reputed exchanges.',
  'Coins with restricted withdrawals and other restrictions have been ignored and blacklisted ',
];

const ModalView = (props) => {
  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        style={customStyles}
        contentLabel="Info Modal"
      >
        <div id="info_container">
          {data.map(text => (
              <div id="info_subContainer">
                <div id="info_icon_container">
                  <Icon type="sketch" id="info_icon" />
                </div>
                <div id="info_text_container">
                  <span id="info_text">{text}</span>
                </div>
              </div>
          ))}
          <div id="info_button_container">
            <Button type="primary" size="large" onClick={props.closeModal}>Proceed</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalView;