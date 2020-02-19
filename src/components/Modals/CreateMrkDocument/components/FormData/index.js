import React from 'react';
import { Typography, Row, Col, Button, Upload } from 'antd';
import { Form, Input } from 'formik-antd';
import { useFormikContext, FieldArray } from 'formik';
import { I18n } from 'react-redux-i18n';
import { get, map } from 'lodash';
import { AttachmentRow, UploadFile } from 'components/Attachment';
import { ATTACHMENT_ACCEPT } from 'constants/general';
import ContentItemTemplate from 'components/ContentItemTemplate';
import Scrollbar from 'components/Scrollbar';
const FormData = ({ showModal }) => {
  const { values } = useFormikContext();

  return <Scrollbar>
    <div style={{ padding: '12px 24px' }}>
      <Row>
        <Typography.Text strong>{get(values, 'document.patternName', '')}</Typography.Text>
      </Row>
      <Row style={{ marginTop: 12 }} >
        <Form layout={'horizontal'}>
          <Form.Item
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            name="document.name"
            label={I18n.t('MrkDocument.name')}
          >
            <Input.TextArea name="document.name" rows={3} />
          </Form.Item>
          {map(values.items, (item, index) => <ContentItemTemplate
            key={index}
            item={item}
            name={`items.${index}`}
          />)}
          <FieldArray
            name="attachments"
            render={arrayHelpers => (
              <Form.Item
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name={`attachments`}
                label={I18n.t('common.attachments')}
              >
                <Row gutter={[0, 16]}>
                  {map(values.attachments, (item, index) => <Col span={12} key={index}>
                    {item.attachment === null ?
                      <UploadFile
                        file={item.file}
                        setAttachment={(el) => arrayHelpers.replace(index, {
                          attachment: el,
                          file: null
                        })}
                      /> :
                      <AttachmentRow
                        onClick={() => showModal('MODAL_ATTACHMENT_EDIT', {
                          mrkAttachment: item.attachment
                        })}
                        attachment={item.attachment}
                        removeAttachment={(e) => {
                          e.stopPropagation();
                          arrayHelpers.remove(index);
                        }}
                      />}
                  </Col>)}
                  <Col span={24}>
                    <Upload fileList={[]} multiple={true}
                      accept={ATTACHMENT_ACCEPT}
                      beforeUpload={(file) => {
                        arrayHelpers.push({
                          attachment: null,
                          file
                        });
                        return false;
                      }}>
                      <Button icon="paper-clip">{I18n.t('common.add_file')}</Button>
                    </Upload>
                  </Col>
                </Row>
              </Form.Item>
            )}
          />
        </Form>
      </Row>
    </div>
  </Scrollbar>;
};

export default FormData;